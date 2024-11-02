const mailer = require('./emailsender');
const User = require('../models/users');
const Role = require('../models/role');
const fileData = require('../models/fileData');
const generatePassword = require('generate-password');
const crypto = require('crypto');
const { checkAuth } = require('../middlewares/authentication');
const { google } = require('googleapis');
const path = require('path');



// google api setup
// const CLIENT_ID='668332731865-91v6qg715rgjdgovfcrfh7trmvjq1nf6.apps.googleusercontent.com';
// const CLIENT_SECRET='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';
// const REDIRECT_URI='https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN='1//04td118-RTCmQCgYIARAAGAQSNwF-L9Ir2u_oWspxLozVEjp8bc5wi3PoaOYvKyuJo78FGaiMNbvhPrfhcug5e-z426bzcedM6LM';

// const oauth2client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );

// oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

// const drive = google.drive({
//   version: 'v3',
//   auth: oauth2client
// });
// // Automatically refresh the access token if it's expired
// oauth2client.on('tokens', (tokens) => {
//   if (tokens.refresh_token) {
//     REFRESH_TOKEN = tokens.refresh_token;
//   }
// });

// google api setup end

// Function to upload file to Google Drive
// const uploadFileToDrive = async (req, file) => {
//   try {
//     const filePath = req.file.path; // Path of the uploaded file

//     // Upload file to Google Drive
//     const response = await drive.files.create({
//       requestBody: {
//         name: req.file.originalname, // Use original filename for Google Drive
//         mimeType: req.file.mimetype,
//       },
//       media: {
//         mimeType: req.file.mimetype,
//         body: fs.createReadStream(filePath),
//       },
//     });

//     // Delete the uploaded file from the server
//     fs.unlinkSync(filePath);

//     console.log('File uploaded to Google Drive:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading file to Google Drive:', error);
//     throw new Error('An error occurred while uploading the file to Google Drive.');
//   }
// };


// const apikeys = require('../config/apikeys.json');
// const SCOPE = ['https://www.googleapis.com/auth/drive'];
// async function authorize(){
//   const jwtClient = new google.auth.JWT(
//       apikeys.client_email,
//       null,
//       apikeys.private_key,
//       SCOPE
//   );

//   await jwtClient.authorize();

//   return jwtClient;
// }


// const uploadFileToDrive = async (authClient, file) => {
//   try {
//     const filePath = file.path; // Path of the uploaded file
//     const folderName = '3D PRINTING'; // Desired folder name

//     // Initialize Google Drive
//     const drive = google.drive({
//       version: 'v3',
//       auth: authClient
//     });

//     // Check if the folder already exists
//     const folderResponse = await drive.files.list({
//       q: `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`,
//       fields: 'files(id, name)',
//       spaces: 'drive'
//     });

//     let folderId;

//     // If folder exists, use its ID, else create a new one
//     if (folderResponse.data.files.length) {
//       folderId = folderResponse.data.files[0].id;
//       console.log(`Folder "${folderName}" already exists with ID: ${folderId}`);
//     } else {
//       // Create the folder in the root directory
//       const folderCreationResponse = await drive.files.create({
//         requestBody: {
//           name: folderName,
//           mimeType: 'application/vnd.google-apps.folder',
//         },
//         fields: 'id'
//       });
//       folderId = folderCreationResponse.data.id;
//       console.log(`Folder "${folderName}" created with ID: ${folderId}`);
//     }

//     // Upload the file to the created or found folder
//     const response = await drive.files.create({
//       requestBody: {
//         name: file.originalname, // Use original filename for Google Drive
//         mimeType: file.mimetype,
//         parents: [folderId] // Set the folder ID
//       },
//       media: {
//         mimeType: file.mimetype,
//         body: fs.createReadStream(filePath),
//       },
//     });

//     // Delete the uploaded file from the server
//     fs.unlinkSync(filePath);

//     console.log('File uploaded to Google Drive:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading file to Google Drive:', error);
//     throw new Error('An error occurred while uploading the file to Google Drive.');
//   }
// };

// const generatePublicUrl = async (fileId,authClient) => {
//   try {
//     const drive = google.drive({ version: 'v3', auth: authClient });
//     // Grant read permission to anyone for the file
//     await drive.permissions.create({
//       fileId: fileId,
//       requestBody: {
//         role: 'reader',
//         type: 'anyone',
//       },
//     });

//     // Retrieve web view link and direct download link for the file
//     const result = await drive.files.get({
//       fileId: fileId,
//       fields: 'webContentLink',
//     });

//     const { webContentLink } = result.data;
//     return {webContentLink };
//   } catch (error) {
//     console.error('Error generating public URL:', error);
//     throw error;
//   }
// };






exports.login = (req, res) => {
  res.render('login');
};

exports.dashboard = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const userCount = await User.countDocuments();
      const fileDataCount = await fileData.countDocuments();
      
     // Count urlHitCount where status is active
      const urlHitCountActive = await fileData.aggregate([
        { $match: { status: "Active" } }, // Filter documents where status is active
        { $group: { _id: null, totalHits: { $sum: "$urlHitCount" } } }
      ]);

      // Extract the total urlHitCount for active files
      const totalUrlHits = urlHitCountActive.length > 0 ? urlHitCountActive[0].totalHits : 0;


      // Count total stlFile and active stlFile
      const totalStlFiles = await fileData.countDocuments();
      const activeStlFiles = await fileData.countDocuments({ status: "Active" });

      res.render('index', { userCount, fileDataCount, totalUrlHits, totalStlFiles, activeStlFiles });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    }
  });
};

exports.profile = (req, res) => {
  checkAuth(req, res, () => {
    res.render('profile');
  });
};
exports.adminlite = (req, res) => {
  checkAuth(req, res, () => {
    res.render('Admin-List');
  });
};

// Admin
exports.adminlist = async (req, res) => {
  try {
    checkAuth(req, res, async () => {
      const users = await User.find();
      const roles = await Role.find();
     res.render('Admin-List', { users, roles,user:'' });
    });
  } catch (error) {
    console.error('Error fetching admin list:', error);
    res.status(500).send('Internal Server Error'); // Send a generic 500 error response
  }
};
// Display add admin form
exports.getAddAdminForm = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const roles = await Role.find();
      res.render('Embed-Admin', { roles,type:'add',user:'' });
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

// Process add admin form submission
exports.addAdmin = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { name, email, role,password } = req.body;

      // Generate a random password
      // const password = generatePassword.generate({
      //   length: 12, // Set the desired length of the password
      //   numbers: true, // Include numbers in the password
      //   symbols: true, // Include symbols in the password
      //   uppercase: true, // Include uppercase letters in the password
      //   lowercase: true, // Include lowercase letters in the password
      // });

      // Create a new user instance with generated password
      const newUser = new User({ name, email, role, password });

      // Save the new user to the database
      await newUser.save();
      const baseUrl = req.protocol + '://' + req.get('host');
      mailer(
        req.body.email, 
        '', 
        '', 
        `Welcome ${req.body.name} to Our 3D Printing Service! 😊 `,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <p>Hi ${req.body.name},</p>
            <p>Thank you for joining our 3D printing service. We're excited to have you on board!</p>
            <p>With our cutting-edge technology and expert team, we're here to help bring your ideas to life through 3D printing.</p>
            <p>Here are your login credentials:</p>
            <ul>
              <li><strong>Username:</strong> ${req.body.email}</li>
              <li><strong>Password:</strong> ${req.body.password}</li>
            </ul>
            <p>To get started, please visit our application (sent by our team) and log in using the provided credentials:</p>
            <p>Once logged in, you can:</p>
            <ul>
              <li>Explore our catalog of 3D printable designs.</li>
              <li>Upload your own designs and let us turn them into reality.</li>
              <li>Track the progress of your orders conveniently from your account.</li>
              <li>Get in touch with our support team if you have any questions or need assistance.</li>
            </ul>
            <p><strong>Download Setup:</strong> You can download the setup file from the following link:</p>
            <p><a href="https://github.com/Apnacoderofficial/3DPrinting-Application/archive/refs/heads/master.zip">Download 3D Printing Application</a></p>
            <p>We look forward to serving you and seeing the amazing projects you will create!</p>
            <p>Best regards,<br>The 3D Printing Team</p>
          </div>
        `
      );
      

      // Redirect to admin list page after successful addition
      res.redirect('/adminlist');
    } catch (error) {
      console.error('Error adding admin:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

// Display edit admin form
exports.getEditAdminForm = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.query;
      const user = await User.findOne({ _id: id }); // Corrected 'users' to 'user'
      const roles = await Role.find();

      if (!user) {
        return res.status(404).send('Admin not found');
      }

      res.render('Embed-Admin', { user, roles, type: 'edit' }); // Changed 'users' to 'user'
    } catch (error) {
      console.error('Error fetching admin:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};


// Process edit admin form submission
exports.editAdmin = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.query;
      const { name, email, role } = req.body;
      await User.findByIdAndUpdate(id, { name, email, role });
      res.redirect('/adminlist');
    } catch (error) {
      console.error('Error editing admin:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};
// Process delete admin
exports.deleteAdmin = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.redirect('/adminlist');
    } catch (error) {
      console.error('Error deleting admin:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};


// Admin Role


exports.adminrole = async (req, res) => {
  try {
    checkAuth(req, res, async () => {
      const roles = await Role.find();
      res.render('adminrole', { roles });
    });
  } catch (error) {
    console.error('Error fetching admin list:', error);
    res.status(500).send('Internal Server Error');
  }
};
exports.getAddRoleForm = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      res.render('Embed-Role', {type:'add' });
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};
// Process add admin form submission
exports.addRole = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { name } = req.body;
      // Create a new user instance with generated password
      const newRole = new Role({ name });
      // Save the new user to the database
      await newRole.save();
      res.redirect('/adminrole');
    } catch (error) {
      console.error('Error adding admin role:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
};
// Display edit role form
exports.getEditRoleForm = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.query; // Destructure id directly from req.query
      const role = await Role.findById(id); // Find role by ID

      if (!role) {
        return res.status(404).send('Role not found');
      }

      // Render the 'Embed-Role' template with role data and type 'edit'
      res.render('Embed-Role', { role, type: 'edit' });
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

// Process edit role form submission
exports.editRole = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.query; // Extract 'id' from query parameters
      const { name } = req.body; // Extract 'name' from request body
      await Role.findByIdAndUpdate(id,{ name });
      res.redirect('/adminrole');
    } catch (error) {
      console.error('Error editing role:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

exports.deleterole = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.params;
      if (id === "66264859c4263172c1bef475") {
        return res.render('Unauthorized-access');
      }
      await Role.findByIdAndDelete(id);
      res.redirect('/adminrole');
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};



// Mail Templates


exports.adminmailTemplates = async (req, res) => {
  try {
    checkAuth(req, res, async () => {
      const mail = await mailTemplates.find();
      res.render('mail_templates', { mail });
    });
  } catch (error) {
    console.error('Error fetching admin list:', error);
    res.status(500).send('Internal Server Error');
  }
};
exports.getAddmailTemplatesForm = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      res.render('Embed-Role', {type:'add' });
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};
// Process add admin form submission
exports.addmailTemplates = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { name } = req.body;
      // Create a new user instance with generated password
      const newRole = new Role({ name });
      // Save the new user to the database
      await newRole.save();
      res.redirect('/adminrole');
    } catch (error) {
      console.error('Error adding admin role:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
};
// Display edit role form
exports.getEditmailTemplatesForm = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.query; // Destructure id directly from req.query
      const role = await mailTemplates.findById(id); // Find role by ID

      if (!role) {
        return res.status(404).send('Role not found');
      }

      // Render the 'Embed-Role' template with role data and type 'edit'
      res.render('Embed-Role', { role, type: 'edit' });
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

// Process edit role form submission
exports.editmailTemplates = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.query; // Extract 'id' from query parameters
      const { name } = req.body; // Extract 'name' from request body
      await mailTemplates.findByIdAndUpdate(id,{ name });
      res.redirect('/adminrole');
    } catch (error) {
      console.error('Error editing role:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

exports.deletemailTemplates = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.params;
      await mailTemplates.findByIdAndDelete(id);
      res.redirect('/adminrole');
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

// Login Logout controller function
exports.loginform = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({
      email
    });

    // Check if user exists
    if (!user) {
      return res.render('usernotfound');
    }

    // Validate password (compare hashed passwords)
    // Note: For production, it's recommended to use a secure method like bcrypt for password hashing
    if (user.password !== password) {
      return res.render('usernotfound');
    }

    console.log('Login Successfully', user.email);
    mailer(email, '', '', `We Are Happy to see you back, ${user.name}`, `Welcome Back Sir i hope you will enjoy our services`);
    // Redirect based on user role
    // Set session as active
    req.session.user = user;
    req.session.isLoggedIn = true;


    if (user.user_type === 'admin') {
      return res.redirect('/dashboard/index');
    } else {
      return res.redirect('/index');
    }

  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Login error:', error);
    // return res.status(500).json({ message: 'Internal server error' });
    return res.redirect('/login');
  }
};

// Logout controller
exports.logout = (req, res) => {
  // Get the email of the logged-out user from the session
  const userEmail = req.session.user ? req.session.user.email : 'Unknown';
  // Send logout email
  // Log the logout event along with the user's email
  console.log(`Logout: ${userEmail}`);
  mailer(userEmail, '', '', `Bye ! ${req.session.user.name} 👋 `, `<div class="container">
          <h1>Bye! <b> ${req.session.user.name}</b></h1>
          <p>We hope that you have enjoyed our store Services ! Kindly Visit Again at your Loved Store.<br>You logged out at: <strong>${new Date().toLocaleString()}</strong></p>
      </div>`);
  // Clear session variables
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
    // Redirect to the login page or any other page after logout
    res.redirect('/login');
  });
};

//File
exports.listStlFiles = (req, res) => {
  checkAuth(req, res, async () => {
    let existingFileList;
    if(req.session.user.role === "66264859c4263172c1bef475"){
      existingFileList = await fileData.find();
    }else{
      existingFileList = await fileData.find({ userEmail:req.session.user.email });
    }
    res.render('listStlFiles', { existingFileList });
  });
};

exports.addStlFile = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const users = await User.find();
      res.render('addStlFile', { type:'Add',users });
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

exports.editStlFile = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.query; 
      const users = await User.find();
      const existingFileData = await fileData.findById(id);

      if (!existingFileData) 
        return res.status(404).send('Existing File Entry not found');

      res.render('addStlFile', { existingFileData, type:'Edit' ,users});
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

exports.saveStlFile = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      let id = req.body.id || null;
      if (!req.file || !req.file.filename) {
        return res.status(404).send('Kindly Also Upload File!');
      }
      const { userEmail, allowedViewCount } = req.body;
      const user = await User.findOne({email : userEmail});
      let stlFileName = req.file && req.file.filename ? req.file.filename :  req.body.stlFileName;
      // let response, publicUrls;

      // if (req.file && req.file.filename) {
      //   response = await uploadFileToDrive(req, req.file.filename);
      //   publicUrls = await generatePublicUrl(response.id);  
      // }
      // if (req.file && req.file.filename) {
      //   let authClient; // Define authClient in a scope accessible to both uploadFileToDrive and generatePublicUrl
      
      //   await authorize()
      //     .then(client => {
      //       authClient = client; // Assign the authorized client to authClient
      //       return uploadFileToDrive(authClient, req.file);
      //     })
      //     .then(async file => {
      //       // console.log('File uploaded:', file);
      //       response = file;
      //       return { file, authClient };
      //     })
      //     .then(async ({ file, authClient }) => {
      //       return generatePublicUrl(file.id, authClient);
      //     })
      //     .then(publicUrl => {
      //       // console.log('Public URLs generated:', publicUrl);
      //       publicUrls = publicUrl;
      //       return publicUrls;
      //     })
      //     .catch(error => {
      //       console.error('Error:', error);
      //     });
      // }

      const data = {
        userName:user.name,
        userEmail,
        allowedViewCount,
        stlFile: stlFileName,
        status: 'Active',
        // fileId: response && response.id ? response.id : req.body.fileId,
        // publicUrls: publicUrls && publicUrls.webContentLink ? publicUrls.webContentLink : req.body.publicUrls,
      };

      if (!id) {
        data.urlHitCount = 0;
        data.token = crypto.randomBytes(16).toString('hex');
        const newFileData = new fileData(data);
        let dataResp = await newFileData.save();
        const baseUrl = req.protocol + '://' + req.get('host');
        mailer(userEmail, '', '', 'Access Granted for 3D Printing STL File', `<div class="container">
          <h1>Hi, <b>${user.name}</b>!</h1>
          <p>
            This is to inform you that access to your 3D printing STL file has been granted. 
            You can view it by visiting the link below and applying the license key provided.
          </p>
          <p>
          License Key: <strong>${data.token}</strong> <!-- Replace with actual license key -->
          </p>
          <p>Date: ${new Date().toLocaleString()}</p>
          <p>
            * If you want to view this kindly install 3D Printing Application.<br>
          Follow the Steps<br>
          <ul>
            <li>Login with your credentials</li>
            <li>Visit to STL TAB and Search the access file</li>
            <li>Search Access file and Enter License Key</li>
          </ul>
          <br>
          By Following this setup you can access the files
          </p>
          </div>`);

       
      } else {
        const existingData = await fileData.findById(id);

        if (!existingData) {
          return res.status(404).send('File Entry not found');
        }
        Object.assign(existingData, data);
        await existingData.save();
      }

      res.redirect('/stlFiles');
    } catch (err) {
      console.error('Error saving file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
};

// exports.saveStlFile = async (req, res) => {
//   checkAuth(req, res, async () => {
//     try {
//       let id = req.body.id || null;
//       const { userName, userEmail, allowedViewCount } = req.body;
//       let stlFileName = req.file && req.file.filename ? req.file.filename :  req.body.stlFileName;
//       let response, publicUrls;

//       if (req.file && req.file.filename) {
//         response = await uploadFileToDrive(req, req.file.filename);
//         publicUrls = await generatePublicUrl(response.id);  
//       }
//       const data = {
//         userName,
//         userEmail,
//         allowedViewCount,
//         stlFile: response && response.name ? response.name : req.body.stlFileName,
//         status: 'Active',
//         fileId: response && response.id ? response.id : req.body.fileId,
//         publicUrls: publicUrls && publicUrls.webContentLink ? publicUrls.webContentLink : req.body.publicUrls,
//       };

//       if (!id) {
//         data.urlHitCount = 0;
//         data.token = crypto.randomBytes(16).toString('hex');
//         const newFileData = new fileData(data);
//         let dataResp = await newFileData.save();
//         const baseUrl = req.protocol + '://' + req.get('host');
//         mailer(userEmail, '', '', `Access Granted for 3D Printing STL File, ${userName}`, `<div class="container">
//           <h1>Hi, <b>${userName}</b>!</h1>
//           <p>
//             This is to inform you that access to your 3D printing STL file has been granted. 
//             You can view it by visiting the link below and applying the license key provided.
//           </p>
//           <p>
//             <a href="${baseUrl}/getFileAuth?id=${dataResp._id}" target="_blank">View STL File</a>
//           </p>
//           <p>
//             License Key: <strong>${data.token}</strong> <!-- Replace with actual license key -->
//           </p>
//           <p>Date: ${new Date().toLocaleString()}</p>
//         </div>`);
//       } else {
//         const existingData = await fileData.findById(id);

//         if (!existingData) {
//           return res.status(404).send('File Entry not found');
//         }
//         Object.assign(existingData, data);
//         await existingData.save();
//       }

//       res.redirect('/stlFiles');
//     } catch (err) {
//       console.error('Error saving file:', err);
//       res.status(500).send('Internal Server Error');
//     }
//   });
// };



exports.deleteStlFile = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const { id } = req.params;

      const existingData = await fileData.findById(id);

      existingData.status = 'Inactive';
      await existingData.save();

      res.redirect('/stlFiles');
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};

exports.getFileAuth = async (req, res) => {
  checkAuth(req, res, async () => {
    const { id } = req.query;
    try {
      const existingFileData = await fileData.findOne({ _id: id, status: 'Active' });
      if (!existingFileData) 
        return res.status(404).send('Existing File Entry not found');
      res.render('getFileAuth', { existingFileData });
    } catch (error) {
      console.error('Error retrieving file data:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};


exports.postFileAuth = async (req, res) => {
  try {
    const { id, bodyToken } = req.body;
    const existingFileData =  await fileData.findOne({ _id: id });

    if (!existingFileData) {
      return res.status(404).send('File not found or inactive');
    }

    if (!existingFileData.allowedViewCount || existingFileData.urlHitCount === undefined || !existingFileData.token) {
      return res.status(500).send('Invalid file data');
    }

    if (existingFileData.token !== bodyToken) {
      return res.render('Unauthorized-access');
    }

    if (existingFileData.allowedViewCount <= existingFileData.urlHitCount) {
      return res.render('View-limit-exceeded.ejs')
    }

    existingFileData.urlHitCount += 1;
    await existingFileData.save();
    const baseUrl = req.protocol + '://' + req.get('host');
    openSTLFileIn3DSprint(`http://165.232.155.106:1234/uploads/${existingFileData.stlFile}`,req.session.version);
    return res.redirect('/stlFiles');

  } catch (error) {
    console.error('Error accessing file:', error);
    return res.status(500).send('Internal Server Error');
  }
};

const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
// const path = require('path');
const puppeteer = require('puppeteer');

async function openSTLFileIn3DSprint(file,version) {
  console.log(file);
  const stlFileUrl = file;
  const userSpecificFolderPath = 'C:/3DPrinting';
  const currentDate = new Date();
  const dateString = currentDate.toISOString().slice(0, 10);
  const localFileName = `strfile_${dateString}.stl`;
  const localFilePath = path.join(userSpecificFolderPath, localFileName);

  try {
    // Check if directory exists or create it
    console.log('Ensuring directory exists:', userSpecificFolderPath);
    await ensureDirectoryExists(userSpecificFolderPath);

    // Check if local file already exists and delete it
    if (fs.existsSync(localFilePath)) {
      console.log(`Deleting existing file: ${localFilePath}`);
      fs.unlinkSync(localFilePath);
      console.log('Existing file deleted successfully');
    }

    // Download STL file
    console.log('Downloading STL file from:', stlFileUrl);
    await downloadSTLFile(stlFileUrl, localFilePath);
    console.log('STL file downloaded successfully');

    // Hide the file
    console.log('Hiding file:', localFilePath);
    await hideFile(localFilePath);
    console.log('File hidden successfully');

    // Launch 3D Sprint
    const launchTime = new Date();
    console.log(`Launching 3D Sprint at: ${launchTime.toLocaleString()}`);
    await launch3DSprint(localFilePath,version); 
    console.log('3D Sprint launched successfully');
  
  } catch (error) {
    console.error('Error downloading, hiding, or launching 3D Sprint:', error);
  }
}

async function ensureDirectoryExists(directoryPath) {
  try {
    await fs.promises.access(directoryPath, fs.constants.F_OK);
  } catch (error) {
    await fs.promises.mkdir(directoryPath, { recursive: true });
  }
}
async function downloadSTLFile(stlFileUrl, localFilePath) {
  const response = await axios({
    method: 'GET',
    url: stlFileUrl,
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(localFilePath);
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  console.log('STL file downloaded successfully');
}
async function hideFile(filePath) {
  const hideCommand = `attrib +h "${filePath}"`;

  return new Promise((resolve, reject) => {
    exec(hideCommand, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
        console.log('File hidden successfully');
      }
    });
  });
}
async function launch3DSprint(localFilePath, version) {
  const executablePath = `C:\\Program Files\\3D Systems\\3D Sprint ${version}\\3DSprint.exe`;
  const command = `"${executablePath}" "${localFilePath}"`;

  try {
    await fs.promises.access(executablePath, fs.constants.X_OK);
    console.log('3D Sprint executable found.');

    // Launch 3D Sprint
    const childProcess = exec(command);

    console.log('3D Sprint launched successfully.');
    setTimeout(() => {
      childProcess.kill();
      exec('taskkill /IM 3DSprint.exe /F', (error, stdout, stderr) => {
        if (error) {
          console.error('Error terminating 3D Sprint process:', error);
        } else {
          console.log('3D Sprint process terminated successfully.');
          console.log('Taskkill output:', stdout);
        }
      });
    }, 30000);


    setTimeout(async() => {
      fs.unlink(localFilePath, (err) => {
        if (err) {
          console.error('Error deleting local file:', err);
        } else {
          console.log('Local file deleted successfully.');
          
          const delay = 60 * 1000; // 1 minute in milliseconds
          console.log(`Scheduling 'Unsync file' after ${delay} milliseconds`);
      
            console.log('Unsync file executed after 1 minute');
            
        }
      });
    }, 30000);
    return; // Resolve the promise
  } catch (error) {
    console.error('Error launching 3D Sprint:', error);
    throw error; // Reject the promise and propagate the error
  }
}

exports.getsetupversion = async (req, res) => {
  checkAuth(req, res, async () => {
    res.render('setup_version')
  });
}

exports.getSettings = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      const user = await User.findById(req.session.user.id);
      res.render('settings', { user:req.session.user });
    } catch (error) {
      console.error("Error fetching data: ", error);
      res.status(500).send("An error occurred while fetching data.");
    }
  });
}


exports.postSettings = async (req, res) => {
  checkAuth(req, res, async () => {
    try {
      // Get the user ID from session
      const userId = req.session.user._id;

      // Extract fields from req.body that are being updated
      const { name, email, role, version } = req.body;

      // Update the user in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,    // Update name if provided
          email,   // Update email
          role,    // Update role
          version  // Update version
        },
        { new: true } // Return the updated document
      );

      // Ensure the database has been updated
      if (updatedUser) {
        // Update the user session with the new data
        req.session.user = updatedUser;

        // Render the settings page with the updated user and versions
        // res.render('settings', { user: updatedUser });
        res.redirect('/stlFiles')
      } else {
        // If the user was not found or updated, handle the error
        res.status(400).send('User not found or not updated.');
      }
    } catch (error) {
      console.error("Error updating user settings: ", error);
      res.status(500).send("An error occurred while updating settings.");
    }
  });
}







module.exports = exports;
