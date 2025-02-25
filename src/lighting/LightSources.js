import * as THREE from 'three';

export class LightSource {
    constructor(name, properties) {
        this.name = name;
        this.flickerAmount = properties.flickerAmount || 0;
        this.lights = properties.lights.map(def => {
            const light = new THREE.PointLight(
                def.color,
                def.intensity,
                def.distance
            );
            light.decay = def.decay;
            light.baseIntensity = def.intensity; // Store original intensity
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
        flickerAmount: 0.99,  // 75% variation - more unstable than torch
        lights: [
            {
                color: 0xffd700,    // Bright yellow core
                intensity: 1.0,      // Bright but very localized
                distance: 3,         // Tiny range for the bright core
                decay: 2.5          // Very rapid falloff
            },
            {
                color: 0xeec600,    // Warm yellow ambient
                intensity: 0.3,      // Dim outer glow
                distance: 15,        // Modest range
                decay: 2.0          // Quick falloff
            }
        ]
    }),

    Torch: new LightSource('Torch', {
        flickerAmount: 0.50,  // 50% variation for torch
        lights: [
            {
                color: 0xffa95c,
                intensity: 10.0,
                distance: 60,
                decay: 1
            },
            {
                color: 0xffc1a0,
                intensity: 20.0,
                distance: 30,
                decay: 1.5
            }
        ]
    }),

    Lantern: new LightSource('Lantern', {
        flickerAmount: 0.25,  // Very subtle 5% variation
        lights: [
            {
                color: 0xffffaa,
                intensity: 20.0,
                distance: 120,
                decay: 1
            },
            {
                color: 0xffffee,
                intensity: 40.0,
                distance: 30,
                decay: 1.5
            }
        ]
    }),

    LightSpell: new LightSource('LightSpell', {
        flickerAmount: 0,  // No flicker for magical light
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