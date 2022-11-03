import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'https://github.com/munizeduardo.png',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Exmaple Pool',
      code: 'BOL123',
      onwerId: user.id,

      participants: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-04T18:00:00.929Z',
      firstTeamCountryCode: 'AF',
      secondTeamCountryCode: 'AO'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-05T18:00:00.929Z',
      firstTeamCountryCode: 'TM',
      secondTeamCountryCode: 'CY',

      guesses: {
        create: {
          firstTeamPoints: 1,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main()