const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const ota = require('zigbee-herdsman-converters/lib/ota');
const tuya = require('zigbee-herdsman-converters/lib/tuya');
const utils = require('zigbee-herdsman-converters/lib/utils');
const globalStore = require('zigbee-herdsman-converters/lib/store');
const e = exposes.presets;
const ea = exposes.access;

const tzDatapoints = {
    ...tuya.tz.datapoints,
    key: [
        'switch_1', 'switch_2', 'countdown_1', 'countdown_2', 'work_mode', 'bright_value', 'temp_value', 'illuminance_value', 
          'presence_state', 'move_sensitivity', 'far_detection',   'target_dis_closest', 'fading_time', 'presence_sensitivity', 'man_state' 
    ],
}

const definition = {
    fingerprint: [ { modelID: 'TS0601', manufacturerName: '_TZE204_ijxvkhd0'}],
    model: 'ZY-M100-24G',
    vendor: 'TuYa',
    description: 'Micro Motion Sensor v1.2 ',
    configure: tuya.configureMagicPacket,
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tzDatapoints],

    exposes: [
        exposes.numeric('illuminance_value', ea.STATE).withDescription('Illuminance').withUnit('lux'),
        exposes.enum('presence_state', ea.STATE, ['none', 'presence', 'move']).withDescription('Presence'), 
        exposes.numeric('move_sensitivity', ea.STATE_SET).withValueMin(1).withValueMax(10).withValueStep(1)
            .withDescription('Move sensitivity'),        
        exposes.numeric('far_detection', ea.STATE_SET).withValueMin(0).withValueMax(10).withValueStep(1)
            .withDescription('Longest distance').withUnit('m'),
        exposes.numeric('target_dis_closest', ea.STATE).withDescription('Distance to target').withUnit('m'),
        exposes.numeric('fading_time', ea.STATE_SET).withValueMin(1).withValueMax(15).withValueStep(1)
            .withDescription('Delay time').withUnit('s'),
        exposes.numeric('presence_sensitivity', ea.STATE_SET).withValueMin(1).withValueMax(10).withValueStep(1)
            .withDescription('Presence sensitivity'),     
        exposes.enum('man_state', ea.STATE, ['nobody','exist']).withDescription('Presence state'),  

    ],
    meta: {
        // All datapoints go in here
        tuyaDatapoints: [
            [104, 'illuminance_value', tuya.valueConverter.raw],
            [105, 'presence_state',     tuya.valueConverterBasic.lookup({'none': tuya.enum(0), 'presence': tuya.enum(1), 'move': tuya.enum(2)})],   
            [106, 'move_sensitivity', tuya.valueConverter.divideBy10],
            [107, 'far_detection', tuya.valueConverter.divideBy100],
            [109, 'target_dis_closest', tuya.valueConverter.divideBy100],
            [110, 'fading_time', tuya.valueConverter.raw],
            [111, 'presence_sensitivity', tuya.valueConverter.divideBy10],
            [112, 'man_state',  tuya.valueConverterBasic.lookup({'nobody': tuya.enum(0), 'exist': tuya.enum(1) })],
         ],
    },
  };

module.exports = definition;
