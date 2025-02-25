import * as THREE from 'three';

export class LightSource {
    constructor(name, properties) {
        this.name = name;
        this.lights = properties.lights.map(def => {
            const light = new THREE.PointLight(
                def.color,
                def.intensity,
                def.distance
            );
            light.decay = def.decay;
            return light;
        });
    }

    attachToObject(object) {
        this.lights.forEach(light => object.add(light));
    }

    setPosition(x, y, z) {
        this.lights.forEach(light => light.position.set(x, y, z));
    }
}

export const LightSources = {
    // intensity describes how intense the light source is, in candela.
    // power describes the luminous power of the light source, in lumens.

    Candle: new LightSource('Candle', {
        lights: [
            {
                color: 0xffd733,    // Bright yellow core
                intensity: 20.0,      // Bright but very localized
                distance: 10,         // Tiny range for the bright core
                decay: 1          // Very rapid falloff
            },
            {
                color: 0xeec600,    // Warm yellow ambient
                intensity: 10,      // Dim outer glow
                distance: 20,        // Modest range
                decay: 1.5          // Quick falloff
            }
        ]
    }),

    Torch: new LightSource('Torch', {
        lights: [
            {
                color: 0xffcc00,
                intensity: 40.0,
                distance: 30,
                decay: 1
            },
            {
                color: 0xaa6600,
                intensity: 20.0,
                distance: 60,
                decay: 1.5
            }
        ]
    }),

    Lantern: new LightSource('Lantern', {
        lights: [
            {
                color: 0xffff66,
                intensity: 20.0,
                distance: 120,
                decay: 1
            },
            {
                color: 0xffffaa,
                intensity: 40.0,
                distance: 30,
                decay: 1.5
            }
        ]
    }),

    LightSpell: new LightSource('LightSpell', {
        lights: [
            {
                color: 0xeeeeff,
                intensity: 40.0,
                distance: 120,
                decay: 1
            },
            {
                color: 0xaaaabb,
                intensity: 80.0,
                distance: 30,
                decay: 1.5
            }
        ]
    })
};