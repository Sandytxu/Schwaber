
const logout = async (req, res) => {
    req.session.destroy(() => {
        return res.status(200).send('session destroyed');
    });
}

module.exports = logout;