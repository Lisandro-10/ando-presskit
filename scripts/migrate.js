"use strict";
/**
 * Migration script: uploads current content from lib/data.ts + public/ to Sanity.
 * Run with: npx tsx scripts/migrate.ts
 *
 * Idempotent: uses deterministic _id + createOrReplace — safe to re-run.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@sanity/client");
var fs = require("fs");
var path = require("path");
var dotenv = require("dotenv");
dotenv.config({ path: '.env.local' });
var client = (0, client_1.createClient)({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: (_a = process.env.NEXT_PUBLIC_SANITY_DATASET) !== null && _a !== void 0 ? _a : 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});
// Rank strings that sort correctly alphabetically for initial ordering
function rank(index) {
    return String(index).padStart(6, '0');
}
function uploadAsset(filePath, type) {
    return __awaiter(this, void 0, void 0, function () {
        var absPath, stream, filename, asset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    absPath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''));
                    stream = fs.createReadStream(absPath);
                    filename = path.basename(absPath);
                    return [4 /*yield*/, client.assets.upload(type, stream, { filename: filename })];
                case 1:
                    asset = _a.sent();
                    console.log("  uploaded ".concat(filename, " \u2192 ").concat(asset._id));
                    return [2 /*return*/, asset];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var photos, _i, _a, _b, i, photo, asset, videos, _c, _d, _e, i, video, asset, heroAsset, liveSets, _f, _g, _h, i, set, contacts, _j, _k, _l, i, contact, biographyColumn1, biographyColumn2;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    // ── Photos ──────────────────────────────────────────────────────────────────
                    console.log('\n📷  Migrating photos...');
                    photos = [
                        { src: '/photos/fiesta_under.jpeg', title: 'RANCHO APARTE', description: '' },
                        { src: '/photos/finca-la-anita.jpg', title: 'FINCA LA ANITA', description: '' },
                        { src: '/photos/piba_16-05-2026.jpg', title: 'PIBÄ BAR', description: '' },
                        { src: '/photos/finca_anita_byn.jpeg', title: 'SUNSET FINCA LA ANITA', description: '' },
                    ];
                    _i = 0, _a = photos.entries();
                    _m.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    _b = _a[_i], i = _b[0], photo = _b[1];
                    return [4 /*yield*/, uploadAsset(photo.src, 'image')];
                case 2:
                    asset = _m.sent();
                    return [4 /*yield*/, client.createOrReplace({
                            _id: "photo-".concat(i),
                            _type: 'photo',
                            title: photo.title,
                            description: photo.description,
                            image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
                            orderRank: rank(i),
                        })];
                case 3:
                    _m.sent();
                    console.log("  \u2713 photo-".concat(i, ": ").concat(photo.title));
                    _m.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    // ── Videos ──────────────────────────────────────────────────────────────────
                    console.log('\n🎬  Migrating videos...');
                    videos = [
                        { src: '/videos/video-1.mp4', orientation: 'wide' },
                        { src: '/videos/piba_16-05-2026.mp4', orientation: 'tall' },
                        { src: '/videos/rancho_aparte_3.mp4', orientation: 'wide' },
                        { src: '/videos/piba.mp4', orientation: 'tall' },
                        { src: '/videos/video-2.mp4', orientation: 'wide' },
                        { src: '/videos/video-5.mp4', orientation: 'tall' },
                    ];
                    _c = 0, _d = videos.entries();
                    _m.label = 6;
                case 6:
                    if (!(_c < _d.length)) return [3 /*break*/, 10];
                    _e = _d[_c], i = _e[0], video = _e[1];
                    return [4 /*yield*/, uploadAsset(video.src, 'file')];
                case 7:
                    asset = _m.sent();
                    return [4 /*yield*/, client.createOrReplace({
                            _id: "video-".concat(i),
                            _type: 'video',
                            file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
                            orientation: video.orientation,
                            orderRank: rank(i),
                        })];
                case 8:
                    _m.sent();
                    console.log("  \u2713 video-".concat(i, ": ").concat(path.basename(video.src)));
                    _m.label = 9;
                case 9:
                    _c++;
                    return [3 /*break*/, 6];
                case 10:
                    // ── Hero background ─────────────────────────────────────────────────────────
                    console.log('\n🖼️   Uploading hero background...');
                    return [4 /*yield*/, uploadAsset('/photos/hero-bg.jpg', 'image')
                        // ── Live Sets ────────────────────────────────────────────────────────────────
                    ];
                case 11:
                    heroAsset = _m.sent();
                    // ── Live Sets ────────────────────────────────────────────────────────────────
                    console.log('\n🎵  Migrating live sets...');
                    liveSets = [
                        { title: 'Hidden Echoes Vol. 1', trackUrl: 'https://soundcloud.com/ando-ku/ando-hidden-echoes-set-vol-1' },
                        { title: 'Echoes in the Dark Set (Vol.2)', trackUrl: 'https://soundcloud.com/ando-ku/ando-echoes-in-the-dark-set' },
                    ];
                    _f = 0, _g = liveSets.entries();
                    _m.label = 12;
                case 12:
                    if (!(_f < _g.length)) return [3 /*break*/, 15];
                    _h = _g[_f], i = _h[0], set = _h[1];
                    return [4 /*yield*/, client.createOrReplace({
                            _id: "liveSet-".concat(i),
                            _type: 'liveSet',
                            title: set.title,
                            trackUrl: set.trackUrl,
                            orderRank: rank(i),
                        })];
                case 13:
                    _m.sent();
                    console.log("  \u2713 liveSet-".concat(i, ": ").concat(set.title));
                    _m.label = 14;
                case 14:
                    _f++;
                    return [3 /*break*/, 12];
                case 15:
                    // ── Contacts ─────────────────────────────────────────────────────────────────
                    console.log('\n📞  Migrating contacts...');
                    contacts = [
                        { name: 'Lisandro Andia', email: 'lisandroandia14@gmail.com', phone: '+54 9 261 2567201', instagram: 'https://instagram.com/lisan_andia' },
                        { name: 'Juan Pablo Andia', phone: '+54 9 261 2191185', instagram: 'https://instagram.com/coloandia' },
                    ];
                    _j = 0, _k = contacts.entries();
                    _m.label = 16;
                case 16:
                    if (!(_j < _k.length)) return [3 /*break*/, 19];
                    _l = _k[_j], i = _l[0], contact = _l[1];
                    return [4 /*yield*/, client.createOrReplace({
                            _id: "contact-".concat(i),
                            _type: 'contact',
                            name: contact.name,
                            email: contact.email,
                            phone: contact.phone,
                            instagram: contact.instagram,
                            orderRank: rank(i),
                        })];
                case 17:
                    _m.sent();
                    console.log("  \u2713 contact-".concat(i, ": ").concat(contact.name));
                    _m.label = 18;
                case 18:
                    _j++;
                    return [3 /*break*/, 16];
                case 19:
                    // ── Site Settings (singleton) ─────────────────────────────────────────────
                    console.log('\n⚙️   Creating siteSettings singleton...');
                    biographyColumn1 = [
                        { _key: 'seg-1-0', text: 'ANDO', emphasis: 'brand' },
                        { _key: 'seg-1-1', text: ' es un proyecto de música House conformado por Juan Pablo y Lisandro Andia, dos primos unidos por la música y el descubrimiento de sonidos en conjunto. Su propuesta sonora transita entre la profundidad del ' },
                        { _key: 'seg-1-2', text: 'Progressive House', emphasis: 'strong' },
                        { _key: 'seg-1-3', text: ' y la energía del ' },
                        { _key: 'seg-1-4', text: 'Tech House', emphasis: 'strong' },
                        { _key: 'seg-1-5', text: ', convergiendo siempre en un groove persistente que funciona como hilo conductor de su identidad. La narrativa de sus sets es progresiva, evolucionando desde sonidos orgánicos hacia momentos de mayor intensidad.' },
                    ];
                    biographyColumn2 = [
                        { _key: 'seg-2-0', text: 'Lo que define a ' },
                        { _key: 'seg-2-1', text: 'ANDO', emphasis: 'brand' },
                        { _key: 'seg-2-2', text: ' es la química natural en el set. Haber crecido juntos escuchando música les permite retroalimentar sus gustos logrando una conexión que se traduce en un sello propio.' },
                    ];
                    return [4 /*yield*/, client.createOrReplace({
                            _id: 'siteSettings',
                            _type: 'siteSettings',
                            heroTagline: 'Progressive House/ Tech House',
                            heroImage: { _type: 'image', asset: { _type: 'reference', _ref: heroAsset._id } },
                            biographyColumn1: biographyColumn1,
                            biographyColumn2: biographyColumn2,
                            socials: {
                                instagram: 'https://instagram.com/ando.ku',
                                soundcloud: '#',
                                spotify: '#',
                            },
                            directEmail: 'info.ando.ku@gmail.com',
                        })];
                case 20:
                    _m.sent();
                    console.log('  ✓ siteSettings');
                    console.log('\n✅  Migration complete!');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
