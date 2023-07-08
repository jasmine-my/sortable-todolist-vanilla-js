// path 모듈 불러오기
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getAbsolutePath = (target) => path.resolve(__dirname, target);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDevMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './src/index.ts',
    output: {
        // 최종 번들링된 자바스크립트
        filename: 'main.js',
        // dist를 배포용 폴더로 사용
        path: path.resolve(__dirname, 'dist'),
    },
    // 환경에 따라 다른 devtool 옵션을 설정한다.
    devtool: isDevMode ? 'eval-source-map' : 'source-map',
    // 템플릿으로 설정할 html파일 위치 설정
    plugins: [
        new HtmlWebpackPlugin({ template: 'src/index.html' }),
    ],
    resolve: {
        // 생략 가능한 확장자
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        // 절대 경로 별칭 등록
        alias: {
            '~components': getAbsolutePath('src/components/'),
            '~styles': getAbsolutePath('src/styles/'),
        },
    },
    target: 'web',
    // 개발 서버 설정
    devServer: {
        static: {
            directory: path.resolve(__dirname, './'),
            // 브라우저상에서 접근할 경로
            publicPath: '/',
            // 정적 파일 수정시 페이지 새로고침 여부
            watch: true,
        },
        hot: true,
        port: 3000,
    },
    module: {
        rules: [
            // Babel 파일 로더 설정
            {
                test: /\.m?js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            // TypeScript 로더 설정
            {
                test: /\.tsx?$/i,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
            // Sass 로더 설정
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // 환경 변수에 따라 다른 스타일 로더 적용
                    isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ],
    },
};