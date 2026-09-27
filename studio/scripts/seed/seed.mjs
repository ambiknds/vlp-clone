import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

// Load environment variables from .env.local
const envPath = path.join(rootDir, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error(`Missing .env.local at ${envPath}`);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const idx = line.indexOf('=');
  if (idx !== -1) {
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const token = env.SANITY_API_DEVELOPER_TOKEN || env.SANITY_API_WRITE_TOKEN || env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  console.error('Missing required Sanity credentials in .env.local');
  process.exit(1);
}

console.log(`Targeting Sanity project: ${projectId}, dataset: ${dataset}`);
console.log(`Using token: ${token.slice(0, 10)}... (developer/write)`);

const mutateUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
const assetUrl = `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}`;

// Asset cache
const assetMap = new Map();

async function uploadImage(url, filename) {
  if (assetMap.has(url)) {
    return assetMap.get(url);
  }
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Vertex-Seed/1.0' } });
    if (!res.ok) {
      console.warn(`Failed to fetch image ${url}: status ${res.status}`);
      return null;
    }
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await res.arrayBuffer());

    const uploadRes = await fetch(`${assetUrl}?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${token}`
      },
      body: buffer
    });

    const data = await uploadRes.json();
    if (data.document?._id) {
      assetMap.set(url, data.document._id);
      return data.document._id;
    } else {
      console.warn(`Upload failed for ${filename}:`, data.error?.description || data);
      return null;
    }
  } catch (err) {
    console.warn(`Error uploading image from ${url}:`, err.message);
    return null;
  }
}

// Format seconds into "M:SS"
function formatDurationDisplay(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Format seconds into "Xh Ym"
function formatCourseDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

// Batch mutation helper
async function commitBatch(mutations) {
  if (mutations.length === 0) return;
  const res = await fetch(mutateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ mutations })
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Sanity mutation error: ${JSON.stringify(data.error)}`);
  }
  return data;
}

// Extract YouTube ID
function extractYouTubeId(url) {
  if (!url) return '9602Yzvd7ik';
  const match = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^&#]+)/);
  return match ? match[1] : '9602Yzvd7ik';
}

// Badge mapping for courses
const BADGE_MAP = {
  'nextjs-app-router-in-depth': 'nextjs',
  'react-performance-engineering': 'react',
  'typescript-for-application-developers': 'typescript',
  'building-ai-apps-with-llms': 'python',
  'retrieval-augmented-generation-from-scratch': 'python',
  'python-for-data-work': 'python',
  'system-design-foundations': 'database',
  'postgresql-for-developers': 'database',
  'devops-with-docker-and-kubernetes': 'docker',
  'practical-web-security': 'nextjs'
};

// Main seed function
async function seed() {
  console.log('\n============================================================');
  console.log('       VERTEX LMS - COMPREHENSIVE SANITY CONTENT SEED       ');
  console.log('============================================================\n');

  // 1. Read seed.ndjson
  const ndjsonPath = path.join(__dirname, 'seed.ndjson');
  const lines = fs.readFileSync(ndjsonPath, 'utf8').trim().split('\n');

  const rawDocs = [];
  for (const line of lines) {
    if (line.trim()) rawDocs.push(JSON.parse(line));
  }
  console.log(`Parsed ${rawDocs.length} raw source documents from seed.ndjson.`);

  // 2. Upload Instructor Photos
  console.log('\n[1/6] Uploading Instructor Portraits & Preparing Documents...');
  const instructorMap = new Map();
  const rawInstructors = rawDocs.filter(d => d._type === 'instructor');

  for (const inst of rawInstructors) {
    const photoUrl = inst.photo?._sanityAsset?.replace(/^image@/, '');
    let assetId = null;
    if (photoUrl) {
      console.log(`  Uploading photo for ${inst.name}...`);
      assetId = await uploadImage(photoUrl, `${inst.slug.current}-portrait.jpg`);
    }

    // Convert bio to string
    let bioText = '';
    if (Array.isArray(inst.bio)) {
      bioText = inst.bio.map(b => b.children?.map(c => c.text).join('')).join('\n\n');
    } else if (typeof inst.bio === 'string') {
      bioText = inst.bio;
    }

    // Convert expertise to string
    let expertiseStr = inst.expertise;
    if (Array.isArray(inst.expertise)) {
      expertiseStr = inst.expertise.join(' • ');
    }

    const doc = {
      _id: inst._id,
      _type: 'instructor',
      name: inst.name,
      slug: inst.slug,
      expertise: expertiseStr,
      bio: bioText,
      photo: assetId
        ? {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId }
          }
        : undefined
    };
    instructorMap.set(doc._id, doc);
  }

  // 3. Upload Course Cover Images & Prepare Courses
  console.log('\n[2/6] Uploading Course Cover Images...');
  const rawCourses = rawDocs.filter(d => d._type === 'course');
  const courseCoverMap = new Map();

  for (const crs of rawCourses) {
    const coverUrl = crs.coverImage?._sanityAsset?.replace(/^image@/, '');
    if (coverUrl) {
      console.log(`  Uploading cover for "${crs.title}"...`);
      const assetId = await uploadImage(coverUrl, `${crs.slug.current}-cover.jpg`);
      if (assetId) courseCoverMap.set(crs._id, assetId);
    }
  }

  // 4. Upload Lesson Thumbnails in Concurrent Batches
  console.log('\n[3/6] Processing Lesson Thumbnails & Documents...');
  const rawLessons = rawDocs.filter(d => d._type === 'lesson');
  const lessonMap = new Map();

  // Find unique thumbnail URLs to upload
  const uniqueThumbs = new Map();
  for (const les of rawLessons) {
    const thumbUrl = les.thumbnail?._sanityAsset?.replace(/^image@/, '');
    if (thumbUrl && !uniqueThumbs.has(thumbUrl)) {
      uniqueThumbs.set(thumbUrl, `lesson-${extractYouTubeId(les.videoUrl)}.jpg`);
    }
  }

  console.log(`  Uploading ${uniqueThumbs.size} unique lesson thumbnails in parallel...`);
  const thumbEntries = Array.from(uniqueThumbs.entries());
  const THUMB_CONCURRENCY = 6;
  for (let i = 0; i < thumbEntries.length; i += THUMB_CONCURRENCY) {
    const chunk = thumbEntries.slice(i, i + THUMB_CONCURRENCY);
    await Promise.all(
      chunk.map(async ([url, filename]) => {
        await uploadImage(url, filename);
      })
    );
    process.stdout.write(`    Progress: ${Math.min(i + THUMB_CONCURRENCY, thumbEntries.length)}/${thumbEntries.length} thumbnails\r`);
  }
  console.log(`\n  Completed thumbnail uploads (${assetMap.size} total image assets uploaded).`);

  // Prepare Lessons with formatted duration and durationSeconds
  for (const les of rawLessons) {
    const rawDuration = typeof les.duration === 'number' ? les.duration : (les.durationSeconds || 360);
    const durationDisplay = formatDurationDisplay(rawDuration);

    const thumbUrl = les.thumbnail?._sanityAsset?.replace(/^image@/, '');
    const assetId = assetMap.get(thumbUrl) || null;

    const lessonDoc = {
      _id: les._id,
      _type: 'lesson',
      title: les.title,
      slug: les.slug,
      videoUrl: les.videoUrl,
      duration: durationDisplay,
      durationSeconds: rawDuration,
      freePreview: Boolean(les.freePreview),
      studentCount: les.studentCount || 1000,
      keyPoints: les.keyPoints || [],
      proTip: les.proTip || undefined,
      notes: les.notes || [],
      resources: les.resources || []
    };

    if (assetId) {
      lessonDoc.thumbnail = {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId }
      };
    }

    lessonMap.set(lessonDoc._id, lessonDoc);
  }

  // 5. Prepare Courses with Strict Duration Sums & Badges
  console.log('\n[4/6] Calculating Course & Module Durations (Module = Sum of Lessons, Course = Sum of Modules)...');
  const courseList = [];

  for (const crs of rawCourses) {
    let totalCourseSeconds = 0;
    const modules = (crs.modules || []).map((mod, modIdx) => {
      let modSeconds = 0;
      const lessonRefs = mod.lessons || [];
      for (const lref of lessonRefs) {
        const ldoc = lessonMap.get(lref._ref);
        if (ldoc) {
          modSeconds += ldoc.durationSeconds;
        }
      }
      totalCourseSeconds += modSeconds;
      return {
        _key: mod._key || `module-${modIdx + 1}`,
        _type: 'module',
        title: mod.title,
        summary: mod.summary || '',
        lessons: lessonRefs
      };
    });

    const formattedDuration = formatCourseDuration(totalCourseSeconds);
    const badge = BADGE_MAP[crs.slug.current] || 'nextjs';
    const coverAssetId = courseCoverMap.get(crs._id);

    const courseDoc = {
      _id: crs._id,
      _type: 'course',
      title: crs.title,
      slug: crs.slug,
      summary: crs.summary,
      level: crs.level ? crs.level.charAt(0).toUpperCase() + crs.level.slice(1) : 'Intermediate',
      price: crs.price ?? 0,
      popular: Boolean(crs.popular),
      studentCount: crs.studentCount || 5000,
      duration: formattedDuration,
      badgeIcon: badge,
      instructor: crs.instructor,
      category: crs.category,
      learningOutcomes: crs.learningOutcomes || [],
      modules
    };

    if (coverAssetId) {
      courseDoc.coverImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: coverAssetId }
      };
    }

    courseList.push(courseDoc);
    console.log(`  Course: "${crs.title}" -> ${modules.length} modules, 12 lessons, total: ${formattedDuration} (${totalCourseSeconds}s)`);
  }

  // 6. Generate Video Intelligence Documents (120)
  console.log('\n[5/6] Generating Video Intelligence Documents for Search Grounding...');
  const videoDocs = [];

  for (const les of lessonMap.values()) {
    const ytid = extractYouTubeId(les.videoUrl);
    const totalSecs = les.durationSeconds;

    const ch1Sec = 0;
    const ch2Sec = Math.round(totalSecs * 0.28);
    const ch3Sec = Math.round(totalSecs * 0.62);
    const ch4Sec = Math.round(totalSecs * 0.85);

    const kp0 = les.keyPoints?.[0] || 'Core Concepts & Principles';
    const kp1 = les.keyPoints?.[1] || 'Hands-on Implementation';
    const kp2 = les.keyPoints?.[2] || 'Best Practices & Common Gotchas';

    const chapters = [
      { _key: `ch-0`, startSeconds: ch1Sec, label: 'Overview & Context' },
      { _key: `ch-1`, startSeconds: ch2Sec, label: kp0 },
      { _key: `ch-2`, startSeconds: ch3Sec, label: kp1 },
      { _key: `ch-3`, startSeconds: ch4Sec, label: kp2 }
    ];

    // Extract text snippets from notes for transcript chunks
    const chunkTexts = [];
    if (Array.isArray(les.notes)) {
      for (const block of les.notes) {
        if (block._type === 'block' && block.children) {
          const t = block.children.map(c => c.text).join(' ').trim();
          if (t && t.length > 20) chunkTexts.push(t);
        }
      }
    }

    if (chunkTexts.length === 0) {
      chunkTexts.push(`In this lesson on ${les.title}, we explore ${kp0}.`);
      chunkTexts.push(`Next, we look at how to implement ${kp1} in modern production code.`);
      chunkTexts.push(`Finally, we review ${kp2} and critical considerations for architecture.`);
    }

    const chunks = chunkTexts.slice(0, 5).map((txt, idx) => {
      const step = Math.floor(totalSecs / (Math.min(chunkTexts.length, 5) + 1));
      return {
        _key: `chunk-${idx}`,
        startSeconds: (idx + 1) * step,
        text: txt
      };
    });

    videoDocs.push({
      _id: `video.${les.slug.current}`,
      _type: 'video',
      videoId: ytid,
      url: les.videoUrl,
      provider: 'youtube',
      chapters,
      chunks
    });
  }

  // 7. Categories (6)
  const rawCategories = rawDocs.filter(d => d._type === 'category');
  const categoryDocs = rawCategories.map(c => ({
    _id: c._id,
    _type: 'category',
    title: c.title,
    slug: c.slug,
    description: c.description
  }));

  // 8. Agent Context Document
  const agentContextDoc = {
    _id: 'agentContext.default',
    _type: 'agentContext',
    name: 'Vertex Search Agent',
    scopeFilter: '_type in ["course", "lesson", "instructor", "category"]',
    instructions: `You are the intelligent search assistant for Vertex LMS.
Return accurate, ranked results for learner queries grounded strictly in our course catalog and lesson videos.

CRITICAL RULES:
1. Grounding: Only return courses, lessons, and timestamps that exist in the database. Never invent titles, timestamps, or durations.
2. Two result types:
   - Video result: A lesson matched at a specific chapter or transcript second. Query video chapters first; fall back to transcript chunks.
   - Lesson result: A lesson matched on its topic, key points, or notes.
3. Ranking: Prefer specific topic matches in titles and key points over broad keyword hits.
4. Wildcards: Use token wildcards (e.g. *server* *actions*) and OR operators for multi-word search.`
  };

  // 9. Execute Batch Mutations to Sanity
  console.log('\n[6/6] Committing Documents to Sanity via Batch Mutations...');
  const allDocumentsToCommit = [
    ...categoryDocs,
    ...Array.from(instructorMap.values()),
    ...Array.from(lessonMap.values()),
    ...courseList,
    ...videoDocs,
    agentContextDoc
  ];

  console.log(`  Total documents to commit: ${allDocumentsToCommit.length}`);
  console.log(`    - Categories: ${categoryDocs.length}`);
  console.log(`    - Instructors: ${instructorMap.size}`);
  console.log(`    - Lessons: ${lessonMap.size}`);
  console.log(`    - Courses: ${courseList.length}`);
  console.log(`    - Video Intelligence Records: ${videoDocs.length}`);
  console.log(`    - Agent Context Document: 1`);

  const BATCH_SIZE = 35;
  const totalBatches = Math.ceil(allDocumentsToCommit.length / BATCH_SIZE);
  for (let i = 0; i < allDocumentsToCommit.length; i += BATCH_SIZE) {
    const chunk = allDocumentsToCommit.slice(i, i + BATCH_SIZE);
    const mutations = chunk.map(doc => ({ createOrReplace: doc }));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    console.log(`  Committing batch ${batchNum}/${totalBatches} (${chunk.length} docs)...`);
    await commitBatch(mutations);
  }

  console.log('\n============================================================');
  console.log('       ALL CONTENT SUCCESSFULLY SEEDED INTO SANITY!         ');
  console.log('============================================================\n');
}

seed().catch(err => {
  console.error('\nSeeding failed:', err);
  process.exit(1);
});
