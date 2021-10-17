import { SocketManager } from "../SocketManager"
import { BeRP } from '../../../../'
import { PluginApi } from '../../pluginApi'
import { ConnectionHandler } from "src/berp/network"

export class EnableRequest {
  private _socket: SocketManager
  private _berp: BeRP
  private _connection: ConnectionHandler
  private _pluginApi: PluginApi
  public requestName = "EnableRequest"
  constructor(socket: SocketManager, berp: BeRP, connection: ConnectionHandler, pluginApi: PluginApi) {
    this._socket = socket
    this._berp = berp
    this._connection = connection
    this._pluginApi = pluginApi
  }
  public onEnabled(): void {
    this._socket.on('Message', (packet) => {
      if (packet.event != "EnableSocket" || this._socket.enabled == true) return
      this._socket.enabled = true
      this._socket.emit("Enabled", packet)
      this._pluginApi.getLogger().success("Socket connection established!")

      return this._socket.sendMessage({
        berp: {
          event: "EnableRequest",
          requestId: packet.requestId,
        },
      })
    })
  }
  public onDisabled(): void {
    //
  }
}
