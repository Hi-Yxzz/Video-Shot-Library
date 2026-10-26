import { resolve } from "node:path";

import { Config } from "@remotion/cli/config";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const projectRoot = process.cwd();

Config.setPublicDir(resolve(projectRoot, "library-sources/remocn/public"));
Config.overrideWebpackConfig((current) => ({
  ...current,
  resolve: {
    ...current.resolve,
    plugins: [
      ...(current.resolve?.plugins ?? []),
      new TsconfigPathsPlugin({
        configFile: resolve(projectRoot, "tsconfig.json"),
        extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"],
      }),
    ],
  },
}));
