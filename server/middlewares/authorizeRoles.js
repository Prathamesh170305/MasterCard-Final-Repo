const authorizeRoles = (roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id).populate("role");

            if (!user || !roles.includes(user.role.name)) {
                return res.status(403).json({ message: "Forbidden: You do not have access to this resource." });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
};

export default authorizeRoles;