const Contact = require('../models/Contact');

// @desc    Get all emergency contacts
// @route   GET /api/contacts
// @access  Private
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ isPrimary: -1, createdAt: 1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    next(err);
  }
};

// @desc    Add emergency contact
// @route   POST /api/contacts
// @access  Private
exports.addContact = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// @desc    Update emergency contact
// @route   PUT /api/contacts/:id
// @access  Private
exports.updateContact = async (req, res, next) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    if (contact.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete emergency contact
// @route   DELETE /api/contacts/:id
// @access  Private
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    if (contact.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await contact.deleteOne();
    res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    next(err);
  }
};
