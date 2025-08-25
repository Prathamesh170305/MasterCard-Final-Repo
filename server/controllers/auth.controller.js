import jwt from 'jsonwebtoken'
import userModel from '../models/user.models.js';
import bcrypt from 'bcrypt';
import transporter from '../config/nodemailer.js';

export const RegisterUser = async (req,res)=>{
    const {name,email,password, linkedinId} = req.body; 

    if(!name || !email || !password || !linkedinId){
        return res.status(400).json({success: false, message:"Missing credentials"})
    } 

    try{
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({success:false, message:'User already exists Please use different email!'})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            linkedinId
        });
        await user.save();

        const token = jwt.sign({
            id: user._id,

        },process.env.JWT_SECRET,{expiresIn: '7d'})

        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000
        }); 

        //adding the confirmation mailer to send confirmation of the registeration
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Registration confirmed!",
            text: `Welcome ${name} to Y4D Skilling program , Your account has been created with the emailId:${email}`
        };
        await transporter.sendMail(mailOptions);
        // console.log("Email sent: ", info);



        res.status(200).json({
            success:true,
        })
    } catch (error) {
        res.status(400).json({success:false, message: error.message})
    }
} 

export const userLogin  = async (req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message:'Please enter the email and password !' 
        })
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const passCheck = await bcrypt.compare(password, user.password);
        if(!passCheck){
            return res.status(401).json({
                success:false,
                message:"Incorrect Password !"
            })
        }
        const token = jwt.sign({
            id: user._id,

        },process.env.JWT_SECRET,{expiresIn: '7d'})
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000
        }); 
        res.status(200).json({
            success:true,
            role: user.role,
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message: error.message,
        }  
        )
    }
};

export const userLogout = async(req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        }
        )
        res.status(200).json({
            success: true,
            message: "Logged out successfully!"
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
};

export const sendOtp = async (req,res) => {
    try {
        const  userId  = req.userId;
        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.status(400).json({
                message:"The user is already verified"
            })
        };
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "OTP Verification ",
            text: `Your otp for the email verification is ${otp}`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message:"verification mail send successfully"
        })  
    } catch (error) {
        res.status(400).json({
            success: false,
            message:error.message
        })
    }
}

export const verifyEmail = async (req, res) => {
    const {otp} = req.body;
    const userId = req.userId;
    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message:"Missing user details"
        });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message:"User not Found"
            });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message:"OTP invalid"
            });
        }
        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message:"OTP expired!"
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully!"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({
            success:true,
            message:"The user is Authenticated"
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const sendResetOtp = async (req, res) => {
    const { email }  = req.body;
    if (!email) {
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    try {
        const user = await userModel.findOne({ email } );
        if (!user) {
            return res.status(404).json({
                success: false,
                message:"User not found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000;

        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Reset OTP",
            text: `Your otp for the password reset is ${otp}`
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            success: true,
            message:"Reset Otp send successfully"
        })

        
    } catch (error) {
        res.status(400).json({
            success: false,
            message:error.message
        })
    }
}
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message:"Email, otp or newPassword are required "
        })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message:"User not Found !"
            })
        }
        if (user.resetOtp === "" || user.resetOtp != otp) {
            return res.status(400).json({
                success: false,
                message:"Invalid Otp"
            })
        }
        if (user.resetOtpExpiredAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message:"Otp expired!"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = ""
        user.resetOtpExpiredAt = 0

        await user.save();

        return res.status(200).json({
            success: true,
            message:"Password Reset Successfully!"
        })
        

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}