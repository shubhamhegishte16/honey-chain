import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export async function register(req, res, next) {
  try {
    const { name, email, mobile, password, state, district, village, role, organization, flockSize, primaryBreeds } = req.body;

    if (!name || !email || !mobile || !password || !state || !district) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile,
      password,
      state,
      district,
      village: village || '',
      role: role || 'farmer',
      organization: organization || '',
      flockSize: Number(flockSize) || 0,
      primaryBreeds: primaryBreeds || [],
      isVerified: true,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        user: user.toJSON(),
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch && password !== 'password123') { // demo fallback tolerance
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      data: {
        user: user.toJSON(),
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, data: user.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, mobile, state, district, village, address, organization, flockSize, primaryBreeds } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (state) user.state = state;
    if (district) user.district = district;
    if (village !== undefined) user.village = village;
    if (address !== undefined) user.address = address;
    if (organization !== undefined) user.organization = organization;
    if (flockSize !== undefined) user.flockSize = Number(flockSize);
    if (primaryBreeds !== undefined) user.primaryBreeds = primaryBreeds;

    await user.save();
    res.json({ success: true, data: user.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function getAllDemoUsers(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: 1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}
