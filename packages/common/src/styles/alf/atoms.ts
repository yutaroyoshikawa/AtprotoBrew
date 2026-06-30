import { StyleSheet } from "react-native";

// スケールは Tailwind v4 と一致 (1 = 4px)
export const atoms = StyleSheet.create({
	// --- Layout ---
	flex_1: { flex: 1 },
	flex_row: { flexDirection: "row" },
	flex_col: { flexDirection: "column" },
	flex_wrap: { flexWrap: "wrap" },
	items_start: { alignItems: "flex-start" },
	items_center: { alignItems: "center" },
	items_end: { alignItems: "flex-end" },
	justify_start: { justifyContent: "flex-start" },
	justify_center: { justifyContent: "center" },
	justify_end: { justifyContent: "flex-end" },
	justify_between: { justifyContent: "space-between" },
	self_start: { alignSelf: "flex-start" },
	self_center: { alignSelf: "center" },
	self_stretch: { alignSelf: "stretch" },
	relative: { position: "relative" },
	absolute: { position: "absolute" },
	inset_0: { top: 0, right: 0, bottom: 0, left: 0 },
	overflow_hidden: { overflow: "hidden" },

	// --- Width / Height ---
	w_full: { width: "100%" },
	h_full: { height: "100%" },

	// --- Padding ---
	p_0: { padding: 0 },
	p_1: { padding: 4 },
	p_2: { padding: 8 },
	p_3: { padding: 12 },
	p_4: { padding: 16 },
	p_5: { padding: 20 },
	p_6: { padding: 24 },
	px_1: { paddingHorizontal: 4 },
	px_2: { paddingHorizontal: 8 },
	px_3: { paddingHorizontal: 12 },
	px_4: { paddingHorizontal: 16 },
	px_5: { paddingHorizontal: 20 },
	px_6: { paddingHorizontal: 24 },
	px_7: { paddingHorizontal: 28 },
	px_8: { paddingHorizontal: 32 },
	px_9: { paddingHorizontal: 36 },
	px_10: { paddingHorizontal: 40 },
	py_1: { paddingVertical: 4 },
	py_2: { paddingVertical: 8 },
	py_3: { paddingVertical: 12 },
	py_4: { paddingVertical: 16 },
	py_12: { paddingVertical: 48 },
	pt_2: { paddingTop: 8 },
	pt_4: { paddingTop: 16 },
	pt_5: { paddingTop: 20 },
	pt_6: { paddingTop: 24 },
	pt_7: { paddingTop: 28 },
	pt_8: { paddingTop: 32 },
	pb_2: { paddingBottom: 8 },
	pb_4: { paddingBottom: 16 },
	pb_6: { paddingBottom: 32 },
	pb_8: { paddingBottom: 64 },

	// --- Margin ---
	m_0: { margin: 0 },
	mt_1: { marginTop: 4 },
	mt_2: { marginTop: 8 },
	mt_4: { marginTop: 16 },
	mb_1: { marginBottom: 4 },
	mb_2: { marginBottom: 8 },
	mb_4: { marginBottom: 16 },

	// --- Gap ---
	gap_1: { gap: 4 },
	gap_2: { gap: 8 },
	gap_3: { gap: 12 },
	gap_4: { gap: 16 },
	gap_5: { gap: 20 },
	gap_6: { gap: 24 },

	// --- Border radius ---
	rounded_sm: { borderRadius: 2 },
	rounded_md: { borderRadius: 6 },
	rounded_lg: { borderRadius: 8 },
	rounded_xl: { borderRadius: 12 },
	rounded_2xl: { borderRadius: 16 },
	rounded_3xl: { borderRadius: 20 },
	rounded_4xl: { borderRadius: 24 },
	rounded_5xl: { borderRadius: 28 },
	rounded_6xl: { borderRadius: 32 },
	rounded_7xl: { borderRadius: 36 },
	rounded_8xl: { borderRadius: 40 },
	rounded_9xl: { borderRadius: 44 },
	rounded_10xl: { borderRadius: 48 },
	rounded_full: { borderRadius: 9999 },

	// --- Border width ---
	border: { borderWidth: 1 },
	border_t: { borderTopWidth: 1 },
	border_b: { borderBottomWidth: 1 },

	// --- Inset edges ---
	top_0: { top: 0 },
	right_0: { right: 0 },
	bottom_0: { bottom: 0 },
	left_0: { left: 0 },

	// --- Z-index ---
	z_10: { zIndex: 10 },
	z_999: { zIndex: 999 },

	// --- Typography (size + lineHeight をペアで) ---
	text_xs: { fontSize: 12, lineHeight: 16 },
	text_sm: { fontSize: 14, lineHeight: 20 },
	text_base: { fontSize: 16, lineHeight: 22 },
	text_md: { fontSize: 16, lineHeight: 24 },
	text_lg: { fontSize: 18, lineHeight: 28 },
	text_xl: { fontSize: 20, lineHeight: 30 },
	text_2xl: { fontSize: 24, lineHeight: 32 },
	text_center: { textAlign: "center" },
	text_left: { textAlign: "left" },

	font_normal: { fontWeight: "400" },
	font_medium: { fontWeight: "500" },
	font_semibold: { fontWeight: "600" },
	font_bold: { fontWeight: "700" },
} as const);
