export const requestHelper = async (context, request, prefix = '', isAnyway = false) => {
    if ((context.state[`isLoaded${prefix}`] || context.state[`isLoading${prefix}`]) && !isAnyway) return;
    context.commit(`setLoaded${prefix}`, false)
    context.commit(`setLoading${prefix}`, true)
    await request();
    context.commit(`setLoaded${prefix}`, true)
    context.commit(`setLoading${prefix}`, false)
}