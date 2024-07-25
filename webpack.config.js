import { sync as globSync } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryFiles = globSync('./assets/js/**/*.js');
console.log(entryFiles);

const makeRelativePath = (absolutePath) => {
	const relativePath = path.relative(process.cwd(), absolutePath);
	return './' + relativePath.replace(/\\/g, '/');
};

export default {
	mode: 'production',
	entry: entryFiles.reduce((acc, filePath) => {
		const entryKey = path.basename(filePath, '.js');
		const formattedPath = makeRelativePath(path.resolve(process.cwd(), filePath));
		acc[entryKey] = formattedPath;
		return acc;
	}, {}),
	output: {
		filename: '[name].bundle.js', // Use [name] to output individual files per entry
		path: path.resolve(__dirname, 'dist'),
	},

	devServer: {
		static: {
			directory: path.join(__dirname, '/'),
		},
		port: 8080,
		hot: true,
		open: true,
	},
};
