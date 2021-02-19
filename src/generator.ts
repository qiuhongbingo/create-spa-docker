import glob from 'fast-glob'
import chalk from 'chalk'
import consola from 'consola'
import { join } from 'path'
import { CWD, GENERATOR_DIR } from './constant'
import Yeoman from 'yeoman-environment'
import Generator from 'yeoman-generator'

const PROMPTS = [
  {
    type: 'input',
    name: 'imageName',
    message: 'Your image name',
  },
]

export class DockerGenerator extends Generator {
  inputs = {
    imageName: '',
  }

  constructor() {
    super([], {
      env: Yeoman.createEnv([], {
        cwd: join(CWD),
      }),
      resolved: GENERATOR_DIR,
    })
  }

  async prompting() {
    const inputs = await this.prompt<Record<string, string>>(PROMPTS)
    this.inputs.imageName = inputs.imageName
  }

  writing() {
    consola.info('Creating docker in your project\n')

    const dockerPath = join(GENERATOR_DIR)
    const dockerFiles = glob.sync(join(dockerPath, '**', '*'), { dot: true })

    dockerFiles.forEach((filePath) => {
      const outputPath = filePath.replace(dockerPath, this.destinationRoot())
      this.fs.copyTpl(filePath, outputPath, this.inputs)
    })
  }

  end() {
    console.log()
    consola.success('Successfully created.')
    consola.success(`Run ${chalk.yellow('make beta')} to create your image!`)
  }
}
