const Professional = require('../models/Professional')
const TypeOfProfessional = require('../models/TypeOfProfessional')


class ProfessionalsController {
    async index(request, response){
        const { id } = request.params;
        
        const professional = await Professional.findByPk(id, {
            include: { association: 'type', attributes: ['description'] }
        });

        return response.status(200).json(professional)
    }
    async show(request, response){
        const professionals = await Professional.findAll({
            include: { association: 'type', attributes: ['description'] }
        });

        return response.status(200).json(professionals)
    }
    async create(request, response){
        const { name, email, phone, situation, type_of_professional } = request.body

        const description = type_of_professional.toUpperCase();
        const [ typeOfProfessional ] = await TypeOfProfessional.findOrCreate({
            where: { description }
        })
        
        const profissional = await Professional.create({
            name, email, phone, situation, type_of_professional: typeOfProfessional.dataValues.id
        })

        return response.status(200).json(profissional)
    }
    async update(request, response){
        const { id } = request.params;
        const { name, email, phone, situation, type_of_professional } = request.body;

        let professional = await Professional.findByPk(id);

        if (!professional) return response.status(404).json()

        const description = type_of_professional.toUpperCase();
        const [ typeOfProfessional ] = await TypeOfProfessional.findOrCreate({
            where: { description }
        })

        const updatedProfessional = await professional.update({
            name, email, phone, situation, type_of_professional: typeOfProfessional.dataValues.id
        })

        return response.status(200).json(updatedProfessional)
    }
    async destroy(request, response){
        const { id } = request.params

        const professional = await Professional.findByPk(id);

        if(!professional) return response.status(404)

        console.log(professional)
        await professional.destroy();

        return response.status(204).json()
    }
}

module.exports = ProfessionalsController