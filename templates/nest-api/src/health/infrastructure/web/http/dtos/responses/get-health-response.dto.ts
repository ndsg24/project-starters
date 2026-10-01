import { ApiProperty } from '@nestjs/swagger'

export class GetHealthResponseDto {
  @ApiProperty({ enum: ['ok'] })
  status!: 'ok'

  @ApiProperty({ format: 'date-time' })
  checkedAt!: string
}
