import { FrontMatterCache } from "obsidian";

// This should soon contain all the magic keys instead of them being hardcoded (with documentation)
export enum DG_KEY {
	// The file should be published to the garden
	PUBLISH = "dg-publish",
	PERMALINK = "dg-permalink",
	IS_HOME = "dg-home",
	METATAGS = "dg-metatags",
	HIDE = "dg-hide",
	HIDE_IN_GRAPH = "dg-hide-in-graph",
	PINNED = "dg-pinned",
	TITLE = "title",
}

export enum GARDEN_KEY {
	PUBLISH = "publish",
	PERMALINK = "permalink",
	IS_HOME = "home",
	METATAGS = "metatags",
	HIDE = "hide",
	HIDE_IN_GRAPH = "hide-in-graph",
	PINNED = "pinned",
	TITLE = "title",
}

export type TFrontmatter = Record<string, unknown> & {
	[DG_KEY.PUBLISH]?: boolean;
	"dg-path"?: string;
	[DG_KEY.PERMALINK]?: string;
	[DG_KEY.IS_HOME]?: boolean;
	"dg-hide-in-graph"?: boolean;
	"dg-hide"?: boolean;
	"dg-pinned"?: boolean;
	"dg-metatags"?: string;
	tags?: string;
};

export type TPublishedFrontMatter = Record<string, unknown> & {
	tags?: string[];
	metatags?: string;
	pinned?: boolean;
	permalink?: string;
	hide?: boolean;
};

export const getGardenFrontMatterKey = (key: DG_KEY) => {
	switch (key) {
		case DG_KEY.IS_HOME:
			return GARDEN_KEY.IS_HOME;
		case DG_KEY.PERMALINK:
			return GARDEN_KEY.PERMALINK;
		case DG_KEY.PUBLISH:
			return GARDEN_KEY.PUBLISH;

		default:
			throw new Error(`Unknown key ${key}`);
	}
};

type ExtractTypeFromTFrontmatter<K extends string> =
	K extends keyof TFrontmatter ? TFrontmatter[K] : unknown;

export const getFrontMatterValue =
	(key: DG_KEY) =>
	(
		frontMatter?: FrontMatterCache,
	): ExtractTypeFromTFrontmatter<typeof key> => {
		if (!frontMatter) return undefined;

		return frontMatter[key];
	};

export const getIsPublished = getFrontMatterValue(DG_KEY.PUBLISH);
export const getPermalink = getFrontMatterValue(DG_KEY.PUBLISH);
export const getIsHome = getFrontMatterValue(DG_KEY.IS_HOME);
