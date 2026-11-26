/**
 * RFC 4122 v4-style identifier. Used for local record IDs only (not secrets),
 * so Math.random is acceptable and avoids a native crypto dependency.
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
