const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path:'./config/.env' });

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connecter a  MongoDB'))
  .catch((err) => console.error('Error lors de la connexion a MongoDB:', err));

  app.get('/' , (req, res) => {
    res.status(200);

    res.set('Content-type', 'text/html');
  
    res.send('<html><body>' +
  
    '<h1>Hello</h1>' +
  
    '</body></html>'
  
    );
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error', details: err.message });
  }
});

app.post('/add', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    if (!name, !email, !password ) {
      return res.status(400).json({ error: 'Name email and password sont obligatoire' });
    }
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Error ', details: err.message });
  }
});

app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'User nexiste pas' });
      }
  
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Error', details: err.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'User nexiste pas' });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'User supprime' });
  } catch (err) {
    res.status(500).json({ error: 'Error', details: err.message });
  }
});


app.listen(PORT, function() {

    console.log('The server is running, ' + ' please, open your browser at http://localhost:%s', PORT);
  
});
