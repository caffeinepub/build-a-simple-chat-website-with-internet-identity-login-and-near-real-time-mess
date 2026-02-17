/**
 * Utility function to trigger a file download in the browser.
 * Creates a temporary anchor element, triggers a click, and cleans up.
 */

export function downloadFile(blobUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = filename;
  anchor.style.display = 'none';
  
  document.body.appendChild(anchor);
  anchor.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(anchor);
  }, 100);
}
