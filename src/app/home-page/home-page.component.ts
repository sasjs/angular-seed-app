import { ChangeDetectionStrategy, Component } from '@angular/core'

interface Tool {
  name: string
  role: string
  description: string
  href: string
}

interface RepoLink {
  label: string
  href: string
  /* shown without the scheme so a long repository URL fits one line; the href
   * keeps the full address */
  text: string
}

/**
 * The home page: what this app is, where its source lives, and the six pieces of
 * the SASjs stack it is built from. Plain markup and CSS - a reader copying this
 * seed should see Angular and SASjs, not somebody else's design system.
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomePageComponent {
  public links: RepoLink[] = [
    {
      label: 'App source code',
      href: 'https://github.com/sasjs/angular-seed-app',
      text: 'github.com/sasjs/angular-seed-app'
    },
    {
      label: 'SASjs source code',
      href: 'https://github.com/sasjs/adapter',
      text: 'github.com/sasjs/adapter'
    },
    {
      label: 'SASjs on NPM',
      href: 'https://www.npmjs.com/search?q=%40sasjs',
      text: 'npmjs.com/@sasjs'
    }
  ]

  public tools: Tool[] = [
    {
      name: 'Adapter',
      role: 'what this app talks to SAS with',
      description:
        'The JavaScript client: requests, uploads, sessions and the request history behind the SAS logs panel.',
      href: 'https://adapter.sasjs.io'
    },
    {
      name: 'Core',
      role: 'the macro library',
      description:
        'The %webout, %mp_abort and %mp_dirlist macros the services here compile from, with a doxygen site for every one.',
      href: 'https://core.sasjs.io'
    },
    {
      name: 'CLI',
      role: 'compile, build, deploy',
      description:
        'One command to compile the services, build the frontend and deploy to Viya, SAS 9 or a SASjs Server.',
      href: 'https://cli.sasjs.io'
    },
    {
      name: 'Server',
      role: 'SAS behind a Node.js server',
      description:
        "A web server wrapping the SAS binary - and what this app's mock target imitates in the browser when there is none.",
      href: 'https://server.sasjs.io'
    },
    {
      name: 'Lint',
      role: 'code quality for SAS',
      description:
        'Linting and formatting for SAS code, in the spirit of the tools you already use for TypeScript.',
      href: 'https://github.com/sasjs/lint'
    },
    {
      name: 'VS Code',
      role: 'the editor extension',
      description:
        'Linting, highlighting and execution, plus compile, build and deploy without leaving the editor.',
      href: 'https://github.com/sasjs/vscode-extension'
    }
  ]
}
