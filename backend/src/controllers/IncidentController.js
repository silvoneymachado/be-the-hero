const connection  = require('../database/connection')


async function getOngById(id) {
  return await connection('ongs')
      .select('*')
      .where({ 'id': id })
      .first();
};

module.exports = {
  async index(request, response){
    const{page = 1} = request.query;

    const [count] = await connection('incidents').count();

    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.whatsapp',
        'ongs.email',
        'ongs.city',
        'ongs.uf'
      ])

      response.header('X-Total-Count', count['count(*)'])

      return response.json(incidents)
  },
  
  async store(request, response){
    const { title, description, value } = request.body
    const ong_id = request.headers.authorization

    const ong = await getOngById(ong_id)

   if(!ong) {
      return response.status(404).json({ message: 'Ong not found, please try again with other login' })
   }
    
   const [id] = await connection('incidents').insert({
    title,
    description,
    value,
    ong_id
  })

  return response.json({ id })
  },

  async delete(request, response){
    const { id } = request.params
    const ong_id = request.headers.authorization

    const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first()

      if(incident.ong_id !== ong_id){
        return response.status(401).json({ error: 'Operation not permited'})
      }

      const ong = await getOngById(ong_id)

      if(!ong) {
          return response.status(404).json({ message: 'Ong not found, please try again with other login' })
      }

      await connection('incidents')
        .where('id', id)
        .delete()

      return response.status(204).send()
  }
}