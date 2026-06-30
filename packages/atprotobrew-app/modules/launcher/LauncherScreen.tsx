import { atoms as a } from "@atprotobrew/common/alf";
import { deriveGridConfig } from "@atprotobrew/common/launcher/launcherGrid";
import { derivePageCount } from "@atprotobrew/common/launcher/launcherLayout";
import {
	cancelEditAtom,
	committedAtom,
	draftAtom,
	enterEditAtom,
	modeAtom,
	moveItemAtom,
	perPageAtom,
	saveEditAtom,
	storeViewsAtom,
} from "@atprotobrew/common/launcher/launcherStore";
import type { LauncherItem, StoreItem } from "@atprotobrew/common/launcher/types";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DragOverlay } from "./DragOverlay";
import { EditTopBar } from "./EditTopBar";
import { LauncherPage } from "./LauncherPage";
import { PageIndicator } from "./PageIndicator";
import { useLauncherDrag } from "./useLauncherDrag";

interface LauncherScreenProps {
	storeViews: StoreItem[];
}

export function LauncherScreen({ storeViews }: LauncherScreenProps) {
	const router = useRouter();
	const { width, height } = useWindowDimensions();
	const insets = useSafeAreaInsets();

	const gridConfig = useMemo(() => deriveGridConfig(width, height, insets), [width, height, insets]);

	const setStoreViews = useSetAtom(storeViewsAtom);
	const setPerPage = useSetAtom(perPageAtom);
	const mode = useAtomValue(modeAtom);
	const committed = useAtomValue(committedAtom);
	const draft = useAtomValue(draftAtom);
	const enterEdit = useSetAtom(enterEditAtom);
	const cancelEdit = useSetAtom(cancelEditAtom);
	const saveEdit = useSetAtom(saveEditAtom);
	const moveItem = useSetAtom(moveItemAtom);

	const isEdit = mode === "EDIT";
	const displayItems: LauncherItem[] = isEdit && draft !== null ? draft : committed;

	useEffect(() => {
		setStoreViews(storeViews);
	}, [storeViews, setStoreViews]);

	useEffect(() => {
		setPerPage(gridConfig.perPage);
	}, [gridConfig.perPage, setPerPage]);

	const pageCount = useMemo(
		() => derivePageCount(displayItems, gridConfig.perPage),
		[displayItems, gridConfig.perPage],
	);

	const drag = useLauncherDrag();

	const [overlayChannel, setOverlayChannel] = useState<{
		channelName: string;
		thumbnail: string;
	} | null>(null);

	const scrollRef = useRef<ScrollView>(null);
	const currentPageRef = useRef(0);

	const handleScroll = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			const p = Math.round(e.nativeEvent.contentOffset.x / width);

			if (p !== currentPageRef.current) {
				drag.currentPage.value = p;
				currentPageRef.current = p;
			}
		},
		[drag.currentPage, width],
	);

	const flipPage = useCallback(
		(delta: number) => {
			const next = currentPageRef.current + delta;

			if (next < 0 || next >= pageCount) {
				return;
			}

			scrollRef.current?.scrollTo({ x: next * width, animated: true });
		},
		[pageCount, width],
	);

	const handleDragEnd = useCallback(
		(id: string, targetAddress: number) => {
			moveItem({ id, targetAddress });
		},
		[moveItem],
	);

	const handleOpenApp = useCallback(
		(item: LauncherItem) => {
			router.push({
				pathname: "/(app)/channels/[channelId]",
				params: { channelId: item.label },
			});
		},
		[router],
	);

	return (
		<View style={[a.flex_1]}>
			{isEdit && <EditTopBar onSave={() => saveEdit()} onCancel={() => cancelEdit()} />}

			<ScrollView
				ref={scrollRef}
				style={[a.flex_1]}
				contentContainerStyle={{ alignItems: "stretch" }}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				{Array.from({ length: pageCount }, (_, page) => (
					<View key={page} style={[{ width, alignSelf: "stretch" }]}>
						<LauncherPage
							page={page}
							items={displayItems}
							isEdit={isEdit}
							gridConfig={gridConfig}
							screenWidth={width}
							isDragging={drag.isDragging}
							draggingId={drag.draggingId}
							hoverAddress={drag.hoverAddress}
							dragX={drag.dragX}
							dragY={drag.dragY}
							gridOriginX={drag.gridOriginX}
							gridOriginY={drag.gridOriginY}
							edgeEnterAt={drag.edgeEnterAt}
							currentPage={drag.currentPage}
							onDragEnd={handleDragEnd}
							onEnterEdit={enterEdit}
							onFlipPage={flipPage}
							onSetOverlayChannel={setOverlayChannel}
							onOpenApp={handleOpenApp}
						/>
					</View>
				))}
			</ScrollView>

			<PageIndicator pageCount={pageCount} currentPage={drag.currentPage} />

			<DragOverlay
				dragX={drag.dragX}
				dragY={drag.dragY}
				isDragging={drag.isDragging}
				iconUri={overlayChannel?.thumbnail ?? null}
				channelName={overlayChannel?.channelName ?? null}
				cellSize={gridConfig.cellSize}
			/>
		</View>
	);
}
