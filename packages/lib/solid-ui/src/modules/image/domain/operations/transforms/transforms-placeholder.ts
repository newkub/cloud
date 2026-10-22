// Image Module - Blurhash Placeholder
// This module handles blur placeholder generation

export const generateBlurPlaceholder = (src: string, width: number = 10, height: number = 10): string => {
	// Simple blur placeholder URL (for actual blurhash, you'd use a library)
	// This returns a tiny placeholder URL for the specified image
	return `/_ipx/w_${width},h_${height},f_jpeg,q_10/${encodeURIComponent(src)}`;
};
