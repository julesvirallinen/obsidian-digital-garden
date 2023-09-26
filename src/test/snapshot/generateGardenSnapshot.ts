import Publisher from "../../publisher/Publisher";
import { Notice } from "obsidian";
import { writeFile } from "fs/promises";
import DigitalGardenSettings from "../../models/settings";

const SNAPSHOT_PATH = "src/test/snapshot/snapshot.md";

export const generateGardenSnapshot = async (
	settings: DigitalGardenSettings,
	publisher: Publisher,
) => {
	const devPluginPath = settings.devPluginPath;

	if (!devPluginPath) {
		new Notice("devPluginPath missing, run generateGardenSettings.mjs");

		return;
	}

	const marked = await publisher.getFilesMarkedForPublishing();
	let fileString = "---\n";

	const notesSortedByCreationDate = marked.notes.sort(
		(note) => note.stat.ctime,
	);

	for (const file of notesSortedByCreationDate) {
		const [content, _] = await publisher.compiler.generateMarkdown(file);
		// TODO: add assets

		fileString += `${content}\n`;
	}
	fileString += "---\n";

	const fullSnapshotPath = `${devPluginPath}/${SNAPSHOT_PATH}`;

	await writeFile(fullSnapshotPath, fileString);
	new Notice(`Snapshot written to ${fullSnapshotPath}`);
	new Notice(`Check snapshot to make sure nothing has accidentally changed`);
};
