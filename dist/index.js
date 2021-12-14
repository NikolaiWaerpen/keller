"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var apollo_server_1 = require("apollo-server");
var client_1 = require("@prisma/client");
var schema_1 = require("./schema");
exports.prisma = new client_1.PrismaClient();
function createOrUpdateUser(_a) {
    var id = _a.id, name = _a.name, email = _a.email, image = _a.image;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.prisma.user.upsert({
                        where: {
                            email: email,
                        },
                        update: {
                            name: name,
                            email: email,
                            image: image,
                        },
                        create: {
                            name: name,
                            email: email,
                            image: image,
                        },
                    })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
var server = new apollo_server_1.ApolloServer({
    schema: schema_1.schema,
    context: function (_a) {
        var req = _a.req;
        return __awaiter(void 0, void 0, void 0, function () {
            var reqUser, isDevelopment, birb, user_1, reqUserFormatted, user;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqUser = (_b = req.headers.from) === null || _b === void 0 ? void 0 : _b.split(","), isDevelopment = process.env.NODE_ENV === "development";
                        if (!reqUser && !isDevelopment)
                            throw new apollo_server_1.AuthenticationError("you are not authenticated");
                        if (!(!reqUser && isDevelopment)) return [3 /*break*/, 2];
                        birb = {
                            name: "Birb",
                            email: "birb@kurzgesagt.com",
                        };
                        return [4 /*yield*/, createOrUpdateUser(birb)];
                    case 1:
                        user_1 = _c.sent();
                        return [2 /*return*/, { prisma: exports.prisma, user: user_1 }];
                    case 2:
                        if (reqUser.length !== 3 && !isDevelopment)
                            throw new apollo_server_1.AuthenticationError("proper user credentials not passed in header");
                        reqUserFormatted = {
                            email: reqUser[0],
                            name: reqUser[1],
                            image: reqUser[2],
                        };
                        return [4 /*yield*/, createOrUpdateUser(reqUserFormatted)];
                    case 3:
                        user = _c.sent();
                        return [2 /*return*/, { prisma: exports.prisma, user: user }];
                }
            });
        });
    },
});
server
    .listen(4000)
    .then(function (_a) {
    var url = _a.url;
    return console.log("server started successfully on ".concat(url));
});
