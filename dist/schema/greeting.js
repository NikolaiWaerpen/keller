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
exports.greetingMutation = exports.deleteGreetingInput = exports.editGreetingInput = exports.createGreetingInput = exports.greetingQuery = exports.greetingObjectType = void 0;
var apollo_server_errors_1 = require("apollo-server-errors");
var nexus_1 = require("nexus");
var nexus_prisma_1 = require("nexus-prisma");
var $name = nexus_prisma_1.Greeting.$name, id = nexus_prisma_1.Greeting.id, title = nexus_prisma_1.Greeting.title, comment = nexus_prisma_1.Greeting.comment, createdAt = nexus_prisma_1.Greeting.createdAt, author = nexus_prisma_1.Greeting.author;
var checkForExistingGreeting = function (id, prisma) { return __awaiter(void 0, void 0, void 0, function () {
    var greeting;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.greeting.findUnique({ where: { id: id } })];
            case 1:
                greeting = _a.sent();
                if (!greeting)
                    throw new apollo_server_errors_1.ApolloError("A greeting with id '".concat(id, "' was not found'"));
                return [2 /*return*/, greeting];
        }
    });
}); };
// QUERIES
exports.greetingObjectType = (0, nexus_1.objectType)({
    name: $name,
    definition: function (t) {
        t.field(id);
        t.field(title);
        t.field(comment);
        t.field(createdAt);
        t.field(author);
    },
});
exports.greetingQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition: function (t) {
        t.nonNull.list.nonNull.field("greetings", {
            type: $name,
            resolve: function (_, __, _a) {
                var prisma = _a.prisma;
                return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, prisma.greeting.findMany()];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                }); });
            },
        });
    },
});
// MUTATIONS
exports.createGreetingInput = (0, nexus_1.inputObjectType)({
    name: "CreateGreetingInput",
    definition: function (t) {
        t.nonNull.string(title.name);
        t.nonNull.string(comment.name);
    },
});
exports.editGreetingInput = (0, nexus_1.inputObjectType)({
    name: "EditGreetingInput",
    definition: function (t) {
        t.nonNull.int(id.name);
        t.nonNull.string(title.name);
        t.nonNull.string(comment.name);
    },
});
exports.deleteGreetingInput = (0, nexus_1.inputObjectType)({
    name: "DeleteGreetingInput",
    definition: function (t) {
        t.nonNull.int(id.name);
    },
});
exports.greetingMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition: function (t) {
        t.field("createGreeting", {
            type: $name,
            args: { input: (0, nexus_1.nonNull)((0, nexus_1.arg)({ type: exports.createGreetingInput.name })) },
            resolve: function (_, _a, context) {
                var _b = _a.input, title = _b.title, comment = _b.comment;
                return __awaiter(void 0, void 0, void 0, function () {
                    var prisma, id;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                prisma = context.prisma, id = context.user.id;
                                return [4 /*yield*/, prisma.greeting.create({
                                        data: {
                                            title: title,
                                            comment: comment,
                                            author: {
                                                connect: {
                                                    id: id,
                                                },
                                            },
                                        },
                                    })];
                            case 1: return [2 /*return*/, _c.sent()];
                        }
                    });
                });
            },
        });
        t.field("editGreeting", {
            type: $name,
            args: { input: (0, nexus_1.nonNull)((0, nexus_1.arg)({ type: exports.editGreetingInput.name })) },
            resolve: function (_, args, _a) {
                var prisma = _a.prisma;
                return __awaiter(void 0, void 0, void 0, function () {
                    var _b, id, title, comment;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = args.input, id = _b.id, title = _b.title, comment = _b.comment;
                                return [4 /*yield*/, checkForExistingGreeting(id, prisma)];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, prisma.greeting.update({
                                        where: { id: id },
                                        data: {
                                            title: title,
                                            comment: comment,
                                        },
                                    })];
                            case 2: return [2 /*return*/, _c.sent()];
                        }
                    });
                });
            },
        });
        t.field("deleteGreeting", {
            type: $name,
            args: { input: (0, nexus_1.nonNull)((0, nexus_1.arg)({ type: exports.deleteGreetingInput.name })) },
            resolve: function (_, _a, _b) {
                var id = _a.input.id;
                var prisma = _b.prisma;
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, checkForExistingGreeting(id, prisma)];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, prisma.greeting.delete({ where: { id: id } })];
                            case 2: return [2 /*return*/, _c.sent()];
                        }
                    });
                });
            },
        });
    },
});
