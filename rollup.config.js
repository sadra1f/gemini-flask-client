import fs from "fs";

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";

const isProduction = !process.env.ROLLUP_WATCH;

const inputDir = "assets/javascript";
const outputDir = "static/javascript";

const files = fs.readdirSync(inputDir).filter(
  (filename) => /\.js$/i.test(filename) //
);

export default [
  // Javascript files
  ...files.map((filename) => ({
    input: `${inputDir}/${filename}`,
    output: {
      file: `${outputDir}/${filename}`,
      format: "iife",
      name: filename.replace(/\.[^/.]+$/, ""), // Remove file extensionF
    },
    plugins: [
      nodeResolve({ browser: true }), //
      commonjs(),
      json(),
      isProduction && terser(),
    ],
  })),

  // Fonts
  {
    input: "assets/index.js",
    output: {
      dir: "static",
    },
    plugins: [
      copy({
        targets: [
          {
            src: "node_modules/@fontsource-variable/inter",
            dest: "static/font",
          },
          {
            src: "node_modules/@fontsource-variable/vazirmatn",
            dest: "static/font",
          },
        ],
      }),
    ],
  },
];
