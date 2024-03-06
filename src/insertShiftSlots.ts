import { insertShiftSlots } from './test';

const shiftId = process.argv[2]; // Get shiftId from command-line argument

if (!shiftId) {
    console.error('Usage: ts-node insertShiftSlotsScript.ts <shiftId>');
    process.exit(1);
}

// Call insertShiftSlots function with shiftId
insertShiftSlots(Number(shiftId));