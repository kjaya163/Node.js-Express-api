const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// Get All contacts
// GET /api/contacts
// access private
const getContacts = asyncHandler(async(req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});


// CREATE new contacts
// POST /api/contacts
// access private
const createContact = asyncHandler(async(req, res) => {
    console.log("The request body is:", req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All Fields are manditory !");
    }

    const contact = await Contact.create({
        name, email, phone, user_id: req.user.id
    });
    res.status(201).json(contact);
});

// Get contact
// GET /api/contacts/:id
// access private
const getContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(200).json(contact);
});

// Update contact
// PUT /api/contacts/:id
// access private
const updateContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User wont have the permition to update other contacts");
    }


    await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true});
    const updatedcontact = await Contact.findById(req.params.id);

    res.status(200).json(updatedcontact);
});

// Delete contact
// DELETE /api/contacts/:id
// access private
const deleteContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);

    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User wont have the permition to update other contacts");
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(contact);
});

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };