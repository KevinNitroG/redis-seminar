import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-chromium';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(DEMO_DIR, '..', '..');
const OUT_DIR = path.join(REPO_ROOT, 'slides', 'se332', 'public', 'demo');
const SERVER_PORT = process.env.DEMO_PORT || process.env.PORT || '3100';
const BASE_URL = process.env.DEMO_URL || `http://localhost:${SERVER_PORT}`;

let serverProcess = null;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const appWasRunning = await isAppAvailable();
  await run('node', ['src/seed.js'], DEMO_DIR);

  if (!appWasRunning) {
    serverProcess = spawn('node', ['src/index.js'], {
      cwd: DEMO_DIR,
      env: { ...process.env, PORT: SERVER_PORT },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });

    serverProcess.stdout.on('data', chunk => process.stdout.write(chunk));
    serverProcess.stderr.on('data', chunk => process.stderr.write(chunk));
    await waitForApp();
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
    deviceScaleFactor: 1,
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.screenshot({ path: shot('01-dashboard.png') });

  await page.click('#btn-open-login');
  await page.screenshot({ path: shot('02-login-modal.png') });

  await Promise.all([
    page.waitForResponse(response => response.url().includes('/auth/login') && response.request().method() === 'POST'),
    page.click('#login-form button[type="submit"]'),
  ]);
  await page.waitForSelector('#profile-authenticated:not(.hidden)');
  await page.screenshot({ path: shot('03-profile-session.png') });

  await page.click('#btn-edit-profile');
  await page.fill('#pf-name', 'Dang Phu Thien Demo');
  await page.fill('#pf-gpa', '9.4');
  await page.screenshot({ path: shot('04-edit-profile.png') });

  await Promise.all([
    page.waitForResponse(response => response.url().includes('/auth/me') && response.request().method() === 'PATCH'),
    page.click('#profile-form button[type="submit"]'),
  ]);
  await page.waitForFunction(() => !document.getElementById('profile-modal').classList.contains('show'));
  await page.screenshot({ path: shot('05-profile-updated.png') });

  await page.click('.tab-btn[data-tab="students"]');
  await page.fill('#student-search', 'thie');
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('06-student-search.png') });

  await page.click('.tab-btn[data-tab="courses"]');
  await page.waitForSelector('#course-list .card');
  await page.click('#course-list .card button[onclick^="openEnroll"]');
  await page.fill('#ef-studentId', '23521476');
  await page.screenshot({ path: shot('07-enroll-modal.png') });

  await browser.close();

  console.log(`Captured demo screenshots in ${OUT_DIR}`);
}

function shot(fileName) {
  return path.join(OUT_DIR, fileName);
}

async function isAppAvailable() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForApp() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (await isAppAvailable()) return;
    await new Promise(resolve => setTimeout(resolve, 400));
  }
  throw new Error(`Timed out waiting for ${BASE_URL}`);
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: false,
    });
    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

main()
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => {
    if (serverProcess) serverProcess.kill();
  });
