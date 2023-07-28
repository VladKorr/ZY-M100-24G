const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require('zigbee-herdsman-converters/lib/tuya');

const definition = {
    // Since a lot of TuYa devices use the same modelID, but use different datapoints
    // it's necessary to provide a fingerprint instead of a zigbeeModel
    fingerprint: [
        {
            // The model ID from: Device with modelID 'TS0601' is not supported
            // You may need to add \u0000 at the end of the name in some cases
            modelID: 'TS0601',
            // The manufacturer name from: Device with modelID 'TS0601' is not supported.
            manufacturerName: '_TZE204_ijxvkhd0',
        },
    ],
    model: 'ZY-M100-24G',
    vendor: 'TuYa',
    description: 'Micro Motion Sensor v1.2 ',
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tuya.tz.datapoints],
    onEvent: tuya.onEventSetTime, // Add this if you are getting no converter for 'commandMcuSyncTime'
    configure: tuya.configureMagicPacket,
    exposes: [
        e.illuminance(),
        exposes.numeric('presence', ea.STATE).withDescription('Presence'),
        exposes.numeric('target_distance', ea.STATE).withDescription('Distance to target').withUnit('m'),
        exposes.numeric('radar_sensitivity', ea.STATE_SET).withValueMin(0).withValueMax(9).withValueStep(1)
            .withDescription('sensitivity of the radar'),
//        exposes.numeric('minimum_range', ea.STATE_SET).withValueMin(0).withValueMax(9.5).withValueStep(0.15)
//            .withDescription('Minimum range').withUnit('m'),
        exposes.numeric('maximum_range', ea.STATE_SET).withValueMin(0).withValueMax(9.5).withValueStep(0.15)
            .withDescription('Maximum range').withUnit('m'),
        exposes.numeric('detection_delay', ea.STATE_SET).withValueMin(0).withValueMax(10).withValueStep(0.1)
            .withDescription('Detection delay').withUnit('s'),
        exposes.numeric('static_sensitivity', ea.STATE_SET).withValueMin(0).withValueMax(9).withValueStep(1)
            .withDescription('Static sensitivity'),
        exposes.numeric('occupation', ea.STATE).withDescription('Occupation')    
        // exposes.text('', ea.STATE).withDescription('not recognize'),
        // Here you should put all functionality that your device exposes
    ],
    meta: {
        // All datapoints go in here
        tuyaDatapoints: [
            [104, 'illuminance', tuya.valueConverter.raw],
            [105, 'occupation', tuya.valueConverterBasic.lookup({'none': 0, 'Occupied': 1, 'Move': 2})],
            [106, 'radar_sensitivity', tuya.valueConverter.divideBy10],
            [107, 'maximum_range', tuya.valueConverter.divideBy100],
//          [108, 'minimum_range', tuya.valueConverter.raw],
            [109, 'target_distance', tuya.valueConverter.divideBy100],
            [110, 'detection_delay', tuya.valueConverter.divideBy10],
            [111, 'static_sensitivity', tuya.valueConverter.divideBy10],
            [112, 'presence',  tuya.valueConverterBasic.lookup({'None': 0, 'At home': 1, })]
        ],
    },
};

module.exports = definition;
