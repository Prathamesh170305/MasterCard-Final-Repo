const xlsx = require('xlsx');
const Student = require('../models/user.model.js'); // Adjust path as needed


function generatePassword(name, email) {
    const namePart = (name || '').replace(/\s/g, '').substring(0, 4).padEnd(4, 'x');
    const emailPart = (email || '').replace(/\s/g, '').substring(0, 4).padEnd(4, 'x');
    return namePart + emailPart;
}


exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Parse Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const studentsData = xlsx.utils.sheet_to_json(sheet);

        // Register students in DB
        const registeredStudents = [];
        for (const data of studentsData) {
            // Adjust fields according to your Excel columns and Student model
            const password = generatePassword(data.Name, data.Email);
            const student = new Student({
                name: data.Name,
                email: data.Email,
                password: password,
                linkedinId: data.linkedinId
            });
            await student.save();
            registeredStudents.push(student);
        }

        res.status(201).json({ message: 'Students registered', students: registeredStudents });
    } catch (error) {
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
};