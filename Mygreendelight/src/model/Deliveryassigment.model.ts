import mongoose from "mongoose";

export interface IDeliveryAssignment {
  _id?: mongoose.Types.ObjectId;

  order: mongoose.Types.ObjectId;

  broadcastedto: mongoose.Types.ObjectId[];

  assignedto: mongoose.Types.ObjectId | null;

  status: "broadcasted" | "assigned" | "completed";

  acceptedat?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}

const DeliveryAssignmentSchema =
  new mongoose.Schema<IDeliveryAssignment>(
    {
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },

      broadcastedto: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      assignedto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      status: {
        type: String,
        enum: [
          "broadcasted",
          "assigned",
          "completed",
        ],
        default: "broadcasted",
      },

      acceptedat: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

const DeliveryAssignment =
  mongoose.models.DeliveryAssignment ||
  mongoose.model<IDeliveryAssignment>(
    "DeliveryAssignment",
    DeliveryAssignmentSchema
  );

export default DeliveryAssignment;