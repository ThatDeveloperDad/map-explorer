export const CellTypes = {
    EMPTY: {
        id: 0,
        surfaces: ['floor', 'ceiling']
    },
    WALL: {
        id: 1,
        surfaces: ['walls']  // actual faces determined by visibility
    }
    // Future expansion:
    // DOOR: { id: 2, surfaces: ['frame', 'door'] },
    // WINDOW: { id: 3, surfaces: ['frame', 'glass'] }
};