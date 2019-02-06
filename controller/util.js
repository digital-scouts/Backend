/* FIXME Check which functions need to be wrapped */

/**
 * Wraps an async function in order to forward promise rejections to the express error handler.
 * If you encounter an async function which needs to throw an error in order to interrupt
 * program flow wrap it with this function before exporting!
 *
 * @param func The function to wrap.
 * @returns {Function} Wrapped function.
 */
function wrapWithRejectionHandler(func) {
    return function(request, response, next) {
        func(request, response, next).catch(next);
    };
}

/**
 * Wraps every exported function with {@link wrapWithRejectionHandler}.
 * Be careful to only wrap async route controller functions async(request, response, next).
 *
 * @param exports An exports node module object.
 */
function addRejectionHandlers(exports) {
    for(let functionName in exports) {
        exports[functionName] = wrapWithRejectionHandler(exports[functionName]);
    }

    return exports;
}

module.exports = {
    wrapWithRejectionHandler: wrapWithRejectionHandler,
    addRejectionHandlers: addRejectionHandlers
};