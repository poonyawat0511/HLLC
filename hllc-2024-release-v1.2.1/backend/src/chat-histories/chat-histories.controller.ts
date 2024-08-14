import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ChatHistoriesService } from './chat-histories.service';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { ChatHistoryEntity } from './entities/chat-history.entity';

@Controller('chat-histories')
export class ChatHistoriesController {
  private readonly messageBuilder = new MessageBuilder('chat-histories');

  constructor(private readonly chatHistoriesService: ChatHistoriesService) {}

  @Post()
  async create(@Body() createChatHistoryDto: CreateChatHistoryDto) {
    const chathistories =
      await this.chatHistoriesService.create(createChatHistoryDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new ChatHistoryEntity(chathistories),
    );
  }

  @Get()
  async findAll() {
    const chatshistories = await this.chatHistoriesService.findAll();
    const chatHistoryEntity = chatshistories.map(
      (chathistories) => new ChatHistoryEntity(chathistories),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      chatHistoryEntity,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const chathistories = await this.chatHistoriesService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new ChatHistoryEntity(chathistories),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChatHistoryDto: UpdateChatHistoryDto,
  ) {
    const chathistories = await this.chatHistoriesService.update(
      id,
      updateChatHistoryDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new ChatHistoryEntity(chathistories),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const chathistories = await this.chatHistoriesService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new ChatHistoryEntity(chathistories),
    );
  }
}
