const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const dbURL =
  "mongodb+srv://admin:admin@cluster0.qnsma.mongodb.net/casestudy?retryWrites=true&w=majority";

// app.listen(3000);
app.use(express.json());
app.use(cors());
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

if (mongoose) {
  console.log("connected to mongoose");
} else {
  console.log("unable to connected to mongoose");
}
app.listen(3000, () => {
  console.log("started at ", 3000);
});
const user = mongoose.model("user", {
  userId: {
    type: String,
    unique: true,
    required: [true, ""],
  },
  fname: {
    type: String,
    // unique: true,
    required: [true, "Please enter your name"],
  },
  lname: {
    type: String,
    // unique: true,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    // unique: true,
    required: [true, "Please enter your email"],
  },
  mobile: {
    type: Number,
    required: [true, "Please enter your mobile number"],
    minlength: 10,
    maxlength: 10,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  role: {
    type: String,
    // required: [true, "Please enter your role"],
    default: "user",
  },
});

app.post("/signup", (req, res) => {
  const data = req.body;
  // console.log(data)
  id = Math.random().toString(16).slice(2);
  const user_data = new user({
    userId: id,
    fname: data.fname,
    lname: data.lname,
    email: data.email,
    mobile: data.mnum,
    // password: bcrypt.hashSync(data.password, saltRounds),
    password: data.pass,
    role: data.role,
  });
  // console.log(user_data);
  try {
    user_data.save();
  } catch (e) {
    console.log("this is error in try block", e);
  }
  // console.log(data)
  res.status(200).send({
    message: "User succesfully added",
  });
});

app.get("/login", (req, res) => {
  var data = req.query;
  console.log(data);

  const findResult = user.find(
    {
      email: data.email,
      // password: bcrypt.hashSync(data.password, saltRounds).toString(),
      password: data.pass,
    },
    (error, result) => {
      console.log(result, error);
      if (error || result.length == 0) {
        console.log("error in finding user");
        res.status(404).send("error in finding user");
      } else {
        console.log(result);
        tosend = {
          userId: result[0].userId,
          fname: result[0].fname,
          lname: result[0].lname,
          email: result[0].email,
          mobile: result[0].mobile,
          role: result[0].role,
          status: 200,
        };
        {
          res.status(201).send(tosend);
        }
      }
    }
  );
  // console.log(findResult);
});

const cart = mongoose.model("cart", {
  userId: {
    type: String,
    unique: true,
    required: [true, ""],
  },
  products: {
    type: Array,
  },
});

app.post("/carts", (req, res) => {
  const data = req.body;
  // console.log(data)
  const cart_data = new cart({
    userId: data.userId,
    products: data.products,
  });
  var findifcart = cart.find(
    {
      userId: data.userId,
    },
    (error, result) => {
      if (error || result.length == 0) {
        try {
          cart_data.save();
        } catch (e) {
          console.log("this is error in try block");
        }
      } else {
        flag = 0;
        // result[0].products.forEach(element => { data.products.push(element)});
        for (var i = 0; i < data.products.length; i++) {
          for (var j = 0; j < result[0].products.length; j++) {
            if (data.products[i].productId == result[0].products[j].productId) {
              result[0].products[j].quantity += data.products[i].quantity;
              flag = 1;
              break;
            }
          }
          if (flag == 0) {
            result[0].products.push(data.products[i]);
          }
        }

        cart.updateOne(
          { userId: data.userId },
          { $set: { products: result[0].products } },
          (error, result) => {}
        );
        res.status(201);
      }
    }
  );
  res.status(201).send({ message: "added to cart" });
});

app.get("/carts", (req, res) => {
  const data = req.query;
  var findResult = cart.find(
    {
      userId: data.userId,
    },
    (error, result) => {
      if (error || result.length == 0) {
        res.status(404).send("Cart is Empty");
      } else {
        // console.log(result);
        res.status(201).send(result);
      }
    }
  );
});

app.post("/carts/delete", (req, res) => {
  const data = req.body;
  var finalcart = [];
  // console.log(data[0])
  var findResult = cart.find(
    {
      userId: data.userId,
    },
    (error, result) => {
      if (error || result.length == 0) {
        res.status(404).send("Cart is Empty");
      } else {
        console.log(data.products);
        // console.log()
        if (data.products.length > 0) {
          for (var i = 0; i < data.products.length; i++) {
            var d = {
              productId: data.products[i].productId,
              quantity: data.products[i].quantity,
            };
            finalcart.push(d);
          }
          cart.updateOne(
            { userId: data.userId },
            { $set: { products: finalcart } },
            (error, result) => {}
          );
        } else {
          cart.deleteMany({ userId: data.userId }, (error, result) => {});
        }
      }
    }
  );
});

const product = mongoose.model("product", {
  userId: {
    type: String,
    required: [true, ""],
  },
  productId: {
    type: String,
    required: [true, ""],
  },
  title: {
    type: String,
    required: [true, ""],
  },
  description: {
    type: String,
    required: [true, ""],
  },
  price: {
    type: String,
    required: [true, ""],
  },
  image: {
    type: String,
    // required: [true, ""],
  },
});

app.post("/products", (req, res) => {
  id = Math.random().toString(16).slice(2);
  const data = req.body;
  console.log(data);
  const product_data = new product({
    userId: data.userId,
    productId: id,
    title: data.title,
    description: data.description,
    price: data.price,
    image: data.image,
  });
  try {
    product_data.save();
  } catch (e) {
    console.log("this is error in try block", e);
  }
  res.status(200).send({
    message: "Product Added Successfully",
  });
});

app.get("/products", (req, res) => {
  const data = req.query;
  var findResult = product.find(
    {
      userId: data.userId,
    },
    (error, result) => {
      if (error || result.length == 0) {
        res.status(404).send("No Products");
      } else {
        res.status(201).send(result);
      }
    }
  );
});

app.get("/allproducts", (req, res) => {
  var products = product.find({}, (error, result) => {
    if (error || result.length == 0) {
      res.status(404).send("No Products");
    } else {
      res.status(201).send(result);
    }
  });
});

app.post("/products/update", (req, res) => {
  const data = req.body;
  console.log(data);
  product.updateOne(
    { productId: data.productId },
    {
      $set: {
        title: data.title,
        description: data.description,
        price: data.price,
        image: data.image,
      },
    },
    (error, result) => {}
  );
  res.status(200).send({
    message: "Product Updated Successfully",
  });
});
