const Trip = require('../models/travlr');

// GET: /trips
const tripsList = async (req, res) => {
    try {
        const docs = await Trip.find({}).exec();
        if (!docs || docs.length === 0) {
            return res.status(404).json({ message: 'No trips found' });
        }
        return res.status(200).json(docs);
    } catch (err) {
        return res.status(500).json({ message: 'DB error', error: err.message });
    }
};

// GET: /trips/:tripCode
const tripsFindByCode = async (req, res) => {
    try {
        const doc = await Trip.findOne({ code: req.params.tripCode }).exec();
        if (!doc) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json(doc);
    } catch (err) {
        return res.status(500).json({ message: 'DB error', error: err.message });
    }
};

// POST: /trips
const tripsAddTrip = async (req, res) => {
    try {
        const created = await Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });
        return res.status(201).json(created);
    } catch (err) {
        return res.status(400).json({ message: 'Create failed', error: err.message });
    }
};

// PUT: /trips/:tripCode
const tripsUpdateTrip = async (req, res) => {
    try {
        const updated = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true, runValidators: true }
        ).exec();

        if (!updated) return res.status(404).json({ message: 'Trip not found' });
        return res.status(200).json(updated);
    } catch (err) {
        return res.status(400).json({ message: 'Update failed', error: err.message });
    }
};

// DELETE: /trips/:tripCode
const tripsDeleteTrip = async (req, res) => {
    try {
        const deleted = await Trip.findOneAndDelete({ code: req.params.tripCode }).exec();
        if (!deleted) return res.status(404).json({ message: 'Trip not found' });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: 'Delete failed', error: err.message });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};
