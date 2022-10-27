import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthConstants } from 'src/socket/constants/health.constants';
import { LocalHealthIndicator } from '../service/indicator/local-health.indicator';

@Controller('health')
export class HealthController {

  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private healthIndicator: LocalHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {

    new Promise( resolve => {
      for (let i = 0; i < 500; i++) {
        this.logger.log(`这是一段文字：${i}`);
      }
    });


    return this.health.check([
      () => this.http.pingCheck('dns', HealthConstants.HEALTH_CHECK_URL, { timeout: 3000 }),
      () => this.healthIndicator.checkMemory(),
      () => this.healthIndicator.isRedisHealthy(),
      () => this.healthIndicator.serverInfo(),
    ]);
  }
}
