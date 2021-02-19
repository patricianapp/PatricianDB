import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import graphqlPlayground from 'graphql-playground-middleware-express';

@Controller('graphql')
export class GraphBrainzController {
  @Get()
  playground(@Req() req: Request, @Res() res: Response): void {
    graphqlPlayground({
      endpoint: '/graphbrainz',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    })(req, res, () => {});
  }
}
