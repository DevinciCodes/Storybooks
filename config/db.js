const mongoose = require('mongoose');
mongoose.set('strictQuery', true);



const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://admin-devin:Devlat411@cluster0.nodjui4.mongodb.net/storybooks", {useNewUrlParser: true});
        
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err){
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB