export const getModuleCheckTable = (req, res) => {
    const moduleCheckTable = req.body;
    res.status(200).json({ success: true, data: moduleCheckTable });
    console.log(moduleCheckTable);
}