/**
 * Optional, read-only-in-code Nexus v0.0.17 adapter. Importing it makes no
 * requests. The host injects the official SDK only after explicit consent.
 * IMPORTANT: Nexus currently documents project:write OAuth scope for syncing,
 * even though this adapter never creates transactions or changes the DAW.
 */
export const NEXUS_SDK_VERSION = '0.0.17';
export const NEXUS_OAUTH_SCOPE = 'project:write';
export const NEXUS_SCOPE_NOTICE = 'Audiotool currently requires project:write permission to synchronize a session. This adapter only reads selected session metadata; the permission itself is broader than read-only. No audio is uploaded, downloaded, played, or modified by this adapter.';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HOSTS = new Set(['audiotool.com', 'www.audiotool.com', 'beta.audiotool.com', 'new.audiotool.com']);
const TRACK_TYPES = ['audioTrack', 'noteTrack', 'patternTrack', 'automationTrack'];
const MAX_TRACKS = 500;
const MAX_TEXT = 240;

export class AudiotoolReadError extends Error {
  constructor(code, message) { super(message); this.name = 'AudiotoolReadError'; this.code = code; }
}
function fail(code, message) { throw new AudiotoolReadError(code, message); }
function shortText(value) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, MAX_TEXT) : '';
}
function field(entity, name) { return entity?.fields?.[name]?.value; }
function finite(value, min, max) { return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max ? value : null; }
function requireAction(value) { if (value !== true) fail('explicit-action-required', 'Start this action explicitly; nothing connects automatically.'); }
function requireProjectConsent(value) { if (value !== true) fail('project-consent-required', 'Confirm you are authorized to read the selected project metadata.'); }
function validatedNow(now) {
  const date = now();
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) fail('invalid-clock', 'A valid observation time is required.');
  return date.toISOString();
}

/** Accept a project UUID, projects/UUID, or an official Studio URL. */
export function normalizeProjectReference(input) {
  if (typeof input !== 'string' || input.length > 1500) fail('invalid-project', 'Paste the selected Audiotool Studio project URL or UUID.');
  let id = input.trim();
  if (id.startsWith('https://')) {
    let url;
    try { url = new URL(id); } catch { fail('invalid-project', 'The project URL is not valid.'); }
    if (!HOSTS.has(url.hostname) || url.username || url.password || url.port || !/^\/studio\/?$/.test(url.pathname)) {
      fail('invalid-project', 'Use a Studio project link on an official Audiotool host.');
    }
    if (url.searchParams.getAll('project').length !== 1) fail('invalid-project', 'The Studio URL must identify one project.');
    id = url.searchParams.get('project');
  } else if (id.startsWith('projects/')) id = id.slice(9);
  if (!UUID.test(id)) fail('invalid-project', 'The selected project needs a valid UUID. Track and playlist links are not Studio projects.');
  id = id.toLowerCase();
  return Object.freeze({ id, name: `projects/${id}`, url: `https://beta.audiotool.com/studio?project=${id}` });
}

function selectedEntities(document, type) {
  const result = document.queryEntities.ofTypes(type).get();
  if (!Array.isArray(result)) fail('sdk-shape', 'The SDK returned an unsupported document query.');
  return result;
}

/**
 * Project metadata is intentionally allow-listed: no collaborators, tokens,
 * descriptions, samples, raw document, or account identity enter the snapshot.
 */
export function inspectSessionDocument(document, metadata, { reference, observedAt, evidenceMode = 'fixture' }) {
  if (!['fixture', 'live-sdk'].includes(evidenceMode)) fail('invalid-evidence-mode', 'Unknown evidence mode.');
  const config = selectedEntities(document, 'config');
  if (config.length > 1) fail('invalid-config', 'Multiple global configurations were returned; no tempo can safely be selected.');
  const warnings = [];
  const tempoBpm = finite(field(config[0], 'tempoBpm'), 30, 1000);
  const numerator = finite(field(config[0], 'signatureNumerator'), 1, 32);
  const denominator = finite(field(config[0], 'signatureDenominator'), 1, 32);
  const tempoAutomation = selectedEntities(document, 'tempoAutomationTrack');
  const enabledTempoAutomation = tempoAutomation.some(entity => field(entity, 'isEnabled') === true);
  const tempoAutomationUnknown = tempoAutomation.some(entity => typeof field(entity, 'isEnabled') !== 'boolean');
  if (!config.length) warnings.push('No global configuration entity was available. No default tempo was invented.');
  else if (tempoBpm === null) warnings.push('Global tempo was unavailable or outside the documented SDK range.');
  if (enabledTempoAutomation) warnings.push('Enabled tempo automation exists; global tempo does not describe the whole performance.');
  if (tempoAutomationUnknown) warnings.push('A tempo-automation enabled state was unreadable.');
  const title = shortText(metadata?.displayName);
  if (!title) warnings.push('Project title was not available.');
  const allTracks = TRACK_TYPES.flatMap(type => selectedEntities(document, type));
  allTracks.sort((a, b) => (finite(field(a, 'orderAmongTracks'), -1e9, 1e9) ?? 1e9) - (finite(field(b, 'orderAmongTracks'), -1e9, 1e9) ?? 1e9) || String(a.id).localeCompare(String(b.id)));
  const tracks = allTracks.slice(0, MAX_TRACKS).map(entity => {
    const playerId = field(entity, 'player')?.entityId;
    const player = playerId ? document.queryEntities.getEntity(playerId) : undefined;
    const label = shortText(field(player, 'displayName'));
    return {
      id: shortText(entity.id), kind: entity.entityType,
      order: finite(field(entity, 'orderAmongTracks'), -1e9, 1e9),
      enabled: typeof field(entity, 'isEnabled') === 'boolean' ? field(entity, 'isEnabled') : null,
      label: label || null,
      labelSource: label ? 'linked-player-display-name' : 'not-available',
      playerType: player ? shortText(player.entityType) : null,
    };
  });
  if (allTracks.length > MAX_TRACKS) warnings.push(`Only the first ${MAX_TRACKS} of ${allTracks.length} timeline tracks are included.`);
  if (evidenceMode === 'fixture') warnings.unshift('SYNTHETIC/OFFLINE FIXTURE. No real Audiotool connection or user project was verified.');
  return {
    schema: 'unmute.audiotool-session-context', schemaVersion: 1,
    observation: { method: evidenceMode === 'live-sdk' ? 'nexus-session-read' : 'offline-fixture', observedAt, sdk: `@audiotool/nexus@${NEXUS_SDK_VERSION}`, synchronizedSessionRead: evidenceMode === 'live-sdk' },
    project: { name: reference.name, url: reference.url, title: title || null, titleSource: title ? 'project-service-display-name' : 'not-available' },
    tempo: { globalBpm: tempoBpm, source: tempoBpm === null ? 'not-available' : 'config.tempoBpm', audioMeasured: false, enabledAutomation: enabledTempoAutomation, automationStateUnknown: tempoAutomationUnknown },
    timeSignature: Number.isInteger(numerator) && Number.isInteger(denominator) ? { numerator, denominator } : null,
    tracks, trackCount: allTracks.length, includedTrackCount: tracks.length,
    privacy: { adapterWrites: false, audioRead: false, automaticStorage: false, automaticUpload: false, oauthScope: NEXUS_OAUTH_SCOPE, oauthScopeIsReadOnly: false },
    claims: { authorshipVerified: false, rightsGranted: false, audioIdentityVerified: false, recordingLanguageVerified: false, culturalContextVerified: false },
    warnings,
  };
}

/**
 * One explicit read → end synchronization. No modify/createTransaction calls.
 * Metadata failure is tolerated, but failed synchronization never yields a
 * successful snapshot. Underlying SDK connection errors are not exported.
 */
export async function readAudiotoolSession(client, projectInput, {
  userInitiated = false, authorizedToRead = false, evidenceMode = 'live-sdk', now = () => new Date(),
} = {}) {
  requireAction(userInitiated); requireProjectConsent(authorizedToRead);
  const reference = normalizeProjectReference(projectInput);
  if (!client || typeof client.open !== 'function') fail('not-connected', 'Connect an authorized Audiotool client first.');
  if (!['fixture', 'live-sdk'].includes(evidenceMode)) fail('invalid-evidence-mode', 'Unknown evidence mode.');
  let metadata, metadataUnavailable = false, document, snapshot, readFailure;
  try {
    if (typeof client.projects?.getProject === 'function') {
      try {
        const response = await client.projects.getProject({ name: reference.name });
        if (response instanceof Error || !response?.project) metadataUnavailable = true;
        else if (response.project.name !== reference.name) fail('project-mismatch', 'Project metadata did not match the selected project.');
        else metadata = response.project;
      } catch (error) {
        if (error instanceof AudiotoolReadError) throw error;
        metadataUnavailable = true;
      }
    } else metadataUnavailable = true;
    document = await client.open(reference.name);
    if (!document || typeof document.start !== 'function' || typeof document.stop !== 'function') fail('sdk-shape', 'The SDK did not return a synchronized document.');
    const started = await document.start();
    if (started instanceof Error) fail('sync-failed', 'The selected Audiotool session could not be synchronized.');
    if (typeof document.connected?.getValue !== 'function' || document.connected.getValue() !== true) fail('not-synchronized', 'The Audiotool session is not connected. No snapshot was recorded.');
    snapshot = inspectSessionDocument(document, metadata, { reference, observedAt: validatedNow(now), evidenceMode });
    if (metadataUnavailable) snapshot.warnings.push('Project service metadata was unavailable; only the synchronized document was read.');
  } catch (error) {
    readFailure = error instanceof AudiotoolReadError ? error : new AudiotoolReadError('read-failed', 'The session could not be read. Check account permission, connection, and project URL. No successful snapshot was recorded.');
  } finally {
    if (document && typeof document.stop === 'function') {
      try { const result = await document.stop(); if (result instanceof Error) throw result; }
      catch { readFailure = new AudiotoolReadError('disconnect-failed', 'Session cleanup could not be confirmed. Close this adapter tab before trying again. No successful snapshot was returned.'); }
    }
  }
  if (readFailure) throw readFailure;
  return snapshot;
}

/** A private controller does not expose token export, write methods, or client. */
export function createAudiotoolReader({ sdk, clientId = '', redirectUrl = '' } = {}) {
  let auth = null, state = 'idle';
  const configured = typeof clientId === 'string' && UUID.test(clientId.trim()) && typeof sdk?.audiotool === 'function';
  return Object.freeze({
    get status() { return configured ? state : 'not-configured'; },
    scopeNotice: NEXUS_SCOPE_NOTICE,
    async connect({ userInitiated = false, acknowledgeBroadScope = false } = {}) {
      requireAction(userInitiated);
      if (!acknowledgeBroadScope) fail('scope-acknowledgement-required', NEXUS_SCOPE_NOTICE);
      if (!configured) fail('not-configured', 'This adapter needs the official SDK and a registered public Audiotool client ID. It is not connected.');
      let url;
      try { url = new URL(redirectUrl); } catch { fail('invalid-redirect', 'Configure the exact registered redirect URI.'); }
      if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || url.username || url.password || url.hash || url.search) fail('invalid-redirect', 'This private adapter accepts only an exact registered http://127.0.0.1 redirect URI without query or fragment.');
      if (['connecting', 'reading'].includes(state)) fail('busy', 'Wait for the current operation to finish.');
      state = 'connecting'; auth = null;
      try {
        const result = await sdk.audiotool({ clientId: clientId.trim(), redirectUrl: url.href, scope: NEXUS_OAUTH_SCOPE });
        if (!['authenticated', 'unauthenticated'].includes(result?.status)) fail('auth-failed', 'Audiotool returned an unsupported authentication result.');
        auth = result; state = result.status === 'authenticated' ? 'ready' : 'login-required';
        return { status: state, scopeNotice: NEXUS_SCOPE_NOTICE };
      } catch { state = 'error'; auth = null; fail('auth-failed', 'Audiotool authorization did not complete. No account data was read.'); }
    },
    beginLogin({ userInitiated = false } = {}) {
      requireAction(userInitiated);
      if (state !== 'login-required' || typeof auth?.login !== 'function') fail('login-not-ready', 'Initialize the adapter and review the requested permission first.');
      auth.login();
    },
    async read(projectInput, consent = {}) {
      if (state !== 'ready' || auth?.status !== 'authenticated') fail('not-connected', 'Connect and authorize Audiotool first.');
      state = 'reading';
      try { return await readAudiotoolSession(auth, projectInput, consent); }
      finally { state = 'ready'; }
    },
    forgetConnection() {
      if (state === 'reading' || state === 'connecting') fail('busy', 'Wait for the current operation to finish before forgetting the connection.');
      auth = null; state = 'idle';
      return { status: state, note: 'Adapter reference forgotten. This does not revoke OAuth permission or erase an exported snapshot. Use Audiotool account controls for revocation.' };
    },
  });
}

/** Explicit portable context for a human-declared version relationship. */
export function linkSessionToPassport(snapshot, { passportId, relationship, note = '', userConfirmed = false } = {}) {
  if (!userConfirmed) fail('link-consent-required', 'Confirm this session belongs to the selected musical version.');
  if (snapshot?.schema !== 'unmute.audiotool-session-context' || snapshot.schemaVersion !== 1) fail('invalid-snapshot', 'Use a session snapshot produced by this adapter.');
  if (!['source-session', 'remix-session', 'cover-session', 'derivative-session', 'related-session'].includes(relationship)) fail('invalid-relationship', 'Choose the relationship of this session to the passport.');
  if (!shortText(passportId)) fail('missing-passport', 'Select a passport identifier.');
  return {
    schema: 'unmute.audiotool-passport-link', schemaVersion: 1,
    passportId: shortText(passportId), relationship, note: shortText(note),
    relationshipBasis: 'user-declared-not-independently-verified',
    sessionContext: JSON.parse(JSON.stringify(snapshot)),
    warning: 'A linked session is context, not an audio fingerprint, authorship proof, permission grant, or confirmation of cultural identity.',
  };
}
