"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoQuery = exports.Todo = void 0;
var nexus_1 = require("nexus");
var todos = [
    {
        id: "1",
        description: "Do 1",
        isComplete: false,
    },
    {
        id: "2",
        description: "Do 2",
        isComplete: true,
    },
    {
        id: "3",
        description: "Do 3",
        isComplete: false,
    },
];
exports.Todo = (0, nexus_1.objectType)({
    name: "Todo",
    definition: function (t) {
        t.string("id");
        t.string("description");
        t.boolean("isComplete");
    },
});
exports.TodoQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition: function (t) {
        t.field("todos", {
            type: "Todo",
            resolve: function () { return todos; },
        });
    },
});
