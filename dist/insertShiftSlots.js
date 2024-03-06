"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./test");
const shiftId = process.argv[2]; // Get shiftId from command-line argument
if (!shiftId) {
    console.error('Usage: ts-node insertShiftSlotsScript.ts <shiftId>');
    process.exit(1);
}
// Call insertShiftSlots function with shiftId
(0, test_1.insertShiftSlots)(Number(shiftId));
