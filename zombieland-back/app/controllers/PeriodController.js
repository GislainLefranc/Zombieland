import Period from "../models/Period.js";

export const getAllPeriods = async (req, res)=>{
    try {
        const periods = await Period.findAll();

        if(!periods.length){
            return res.status(404).json({message: 'Periods not found'});
        }
        res.status(200).json(periods);
    } catch (error) {
        console.error('Server error while fetching periods', error);
        res.status(500).json({message: 'Server error while fetching periods'});
        
    }
};

export const getOnePeriod = async (req, res)=> {
    try {
        const periodId = req.params.id;
        const period = await Period.findByPk(periodId);
        if(!period){
            return res.status(404).json({message: 'Period not found'})
        }
        res.status(200).json(period);
    } catch (error) {
        console.error('Server error while fetching periods', error);
        res.status(500).json({message: 'Server error while fetching periods'});
    }
};

export const createPeriod = async (req, res) =>{
    try {
        const { name, date_start, date_end, price } = req.body;
        if(!name){
            return res.status(400).json({message: "A period must have a name"})
        }
        const newPeriod = await Period.create({name, date_start, date_end, price});
        if (!newPeriod){
            return res.status(500).json({message: 'Something went wrong'})
        }

        res.status(201).json(newPeriod)
    } catch (error) {
        console.error('Server error while creating period', error);
        res.status(500).json({message: 'Server error while creating period'});
    }
};

export const updatePeriod = async(req, res) =>{
    try {
        const periodId = req.params.id;
        const{name, date_start, date_end, price} = req.body;
        const period = await Period.findByPk(periodId);
        if(!period){
            return res.status(404).json({message : 'Period not found'});
        }
        period.name = name;
        period.date_start = date_start;
        period.date_end = date_end;
        period.price = price;
        await period.save();
        
        res.status(200).json(period);
    } catch (error) {
        console.error('Server error while updating period', error);
        res.status(500).json({message: 'Server error while updating period'});
    }
};

export const deletePeriod = async (req, res) =>{
    try {
        const periodId = req.params.id;
        const period = await Period.findByPk(periodId);
        if(!period){
            return res.status(404).json({message: 'Category not found'});
        }

        await period.destroy();
        res.status(204).json({message: 'Period is destroyed'})
    } catch (error) {
        console.error('Server error while deleting period', error);
        res.status(500).json({message: 'Server error while deleting period'});
    }
}