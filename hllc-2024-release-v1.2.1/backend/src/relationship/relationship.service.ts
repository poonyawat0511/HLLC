import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RelationShip } from './schemas/relationship.schemas';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectModel(RelationShip.name)
    private readonly relationShipModel: Model<RelationShip>,
    @InjectModel(User.name) // Ensure this is the correct User model
    private readonly userModel: Model<User>,
  ) {}

  async create(
    createRelationshipDto: CreateRelationshipDto,
  ): Promise<RelationShip> {
    try {
      const createRelationship = new this.relationShipModel(
        createRelationshipDto,
      );
      const relationship = await createRelationship.save();
      return relationship.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate key error');
      } else if (
        error.message === 'The reverse relationship already exists.' ||
        error.message === 'Sender and receiver cannot be the same person.'
      ) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async findAll(): Promise<RelationShip[]> {
    try {
      const relationships = await this.relationShipModel.find().lean();
      return relationships;
    } catch (error) {
      console.error('Error fetching relationships:', error);
      throw new Error('An error occurred while fetching relationships');
    }
  }

  async findOne(id: string): Promise<RelationShip> {
    const relationship = await this.relationShipModel.findById(id).lean();
    if (!relationship) {
      throw new NotFoundException(`Relationship with ID ${id} not found`);
    }
    return relationship;
  }

  async findByUserId(userId: string): Promise<RelationShip[]> {
    try {
      const relationship = await this.relationShipModel
        .find({
          $or: [{ receiver: userId }, { sender: userId }],
        })
        .populate('receiver')
        .populate('sender')
        .lean();
      return relationship;
    } catch (error) {
      throw new NotFoundException(`Relationship with ID ${userId} not found`);
    }
  }

  async update(
    id: string,
    updateRelationshipDto: UpdateRelationshipDto,
  ): Promise<RelationShip> {
    const relationship = await this.relationShipModel
      .findByIdAndUpdate(id, updateRelationshipDto, { new: true })
      .lean();
    if (!relationship) {
      throw new NotFoundException(`Relationship with ID ${id} not found`);
    }
    return relationship;
  }

  async remove(id: string): Promise<RelationShip> {
    const relationship = await this.relationShipModel
      .findByIdAndDelete(id)
      .lean();
    if (!relationship) {
      throw new NotFoundException(`Relationship with ID ${id} not found`);
    }
    return relationship;
  }

  async findAllWithFriendCounts(): Promise<any[]> {
    try {
      // Fetch all relationships with populated sender and receiver fields
      const relationships = await this.relationShipModel
        .find()
        .populate({
          path: 'sender',
          select: 'name major',
          populate: {
            path: 'major',
            select: 'name', // Adjust based on the fields you need from Major
          },
        })
        .populate({
          path: 'receiver',
          select: 'name major',
          populate: {
            path: 'major',
            select: 'name', // Adjust based on the fields you need from Major
          },
        })
        .lean(); // Use lean() to get plain JavaScript objects

      // Initialize a map to keep track of unique friends for each user
      const userFriends: { [key: string]: Set<string> } = {};

      // Iterate through the relationships to populate the userFriends map
      relationships.forEach((relationship) => {
        const senderId = relationship.sender._id.toString();
        const receiverId = relationship.receiver._id.toString();

        // Initialize sets for sender and receiver if not already present
        if (!userFriends[senderId]) {
          userFriends[senderId] = new Set<string>();
        }
        if (!userFriends[receiverId]) {
          userFriends[receiverId] = new Set<string>();
        }

        // Add each other as friends
        userFriends[senderId].add(receiverId);
        userFriends[receiverId].add(senderId);
      });

      // Fetch user details for all involved users
      const userIds = Object.keys(userFriends).map(
        (id) => new Types.ObjectId(id),
      );
      const users = await this.userModel
        .find({
          _id: { $in: userIds },
        })
        .populate('major', 'name') // Populate major field with name
        .lean();

      // Map user details by userId
      const userDetails: {
        [key: string]: { fullName: string; major: string };
      } = {};
      users.forEach((user) => {
        userDetails[user._id.toString()] = {
          fullName: `${user.name.first} ${user.name.last}`,
          major: (user.major as any)?.name || 'Unknown Major', // Use type assertion
        };
      });

      // Create an array of objects with friend counts, user details, and major
      const friendCounts = Object.keys(userFriends).map((userId) => {
        const user = userDetails[userId];
        return {
          userId,
          fullName: user ? user.fullName : 'Unknown User',
          major: user ? user.major : 'Unknown Major',
          friendCount: userFriends[userId].size,
        };
      });

      return friendCounts;
    } catch (error) {
      console.error('Error fetching relationships with friend counts:', error);
      throw new Error(
        'An error occurred while fetching relationships with friend counts',
      );
    }
  }
}
